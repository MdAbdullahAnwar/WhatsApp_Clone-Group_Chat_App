const { uploadFileToCloudinary } = require("../config/cloudinaryConfig");
const Conversation = require("../models/Conversation");
const response = require("../utils/responseHandler");
const Message = require("../models/Message");

exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content, messageStatus } = req.body;
    const file = req.file;

    const participants = [senderId, receiverId].sort();
    //check if conversation alredy exits
    let conversation = await Conversation.findOne({
      participants: participants,
    });

    if (!conversation) {
      conversation = new Conversation({
        participants,
      });
      await conversation.save();
    }

    let imageOrVideoUrl = null;
    let contentType = null;

    //hanlde file upload
    if (file) {
      const uploadFile = await uploadFileToCloudinary(file);

      if (!uploadFile.secure_url) {
        return response(res, 400, "Failed to upload media");
      }

      imageOrVideoUrl = uploadFile?.secure_url;

      if (file.mimetype.startwith("image")) {
        contentType = "image";
      } else if (file.mimetype.startwith("video")) {
        contentType = "video";
      } else {
        return response(res, 400, "Unsupported file type");
      }
    } else if (content?.trim()) {
      contentType = "text";
    } else {
      return response(res, 400, "Message content is required");
    }

    const message = new Message({
      conversation: conversation?._id,
      sender: senderId,
      receiver: receiverId,
      content,
      imageOrVideoUrl,
      contentType,
      messageStatus,
    });

    await message.save();

    if (message?.content) {
      conversation.lastMessage = message?.id;
    }

    conversation.unreadCount += 1;
    await conversation.save();

    const populatedMesssage = await Message.findOne(message?._id)
      .populate("sender", "username profilePicture")
      .populate("receiver", "username profilePicture");

    return response(res, 201, "Message sent successfully", populatedMesssage);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

// Get All Conversation

exports.getConversation = async (req, res) => {
  const userId = req.user.userId;
  try {
    // const userId = req.user?.userId;
    let conversation = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "username profilePicture isOnline lastSeen")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender receiver",
          select: "username profilePicture",
        },
      })
      .sort({ updatedAt: -1 });

    return response(
      res,
      201,
      "All conversations fetched successfully",
      conversation
    );
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

// Get messages of specific conversation
exports.getMessages = async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user.userId;

  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return response(res, 404, "Conversation not found");
    }

    if (!conversation.participants.includes(userId)) {
      return response(
        res,
        403,
        "You are not authorized to access this conversation"
      );
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "username profilePicture")
      .populate("receiver", "username profilePicture")
      .sort({ createdAt: 1 });

    await Message.updateMany(
      {
        conversation: conversationId,
        receiver: userId,
        messageStatus: { $in: ["send", "delivered"] },
      },
      { $set: { messageStatus: "read" } }
    );

    conversation.unreadCount = 0;
    await conversation.save();
    return response(res, 200, "Messages retrived successfully", messages);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};


exports.markAsRead = async (req, res) => { 
  const {messageIds} = req.body;
  const userId = req.user.userId;

  try{
    let messages = await Message.find({ 
      _id: { $in: messageIds }, 
      receiver: userId, 
    })

    await Message.updateMany(
      { _id: { $in: messageIds }, receiver: userId },
      { $set: { messageStatus: "read" }}
    );

    return response(res, 200, "Messages marked as read successfully", messages);
  }catch(error){
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};


exports.deleteMessage =  async(req,res) => {
  const {messageId} = req.params;
  const userId = req.user.userId;
  try{
    const message = await Message.findById(messageId);

    if(!message){
      return response(res, 404, "Message not found");
    };
    
    if(message.sender.toString() !== userId){
      return response(res, 403, "You are not authorized to delete this message");
    }

    await message.deleteOne();

    return response(res, 200, "Message deleted successfully");
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
}

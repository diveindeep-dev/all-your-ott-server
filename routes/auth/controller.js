import User from '../../models/User.js';
import jwt from 'jsonwebtoken';
import { statusCode } from '../../config/index.js';

export const checkId = async (req, res, next) => {
  try {
    const checkedId = req.params.checkedId;
    const isUser = await User.findOne({ profileId: checkedId });
    if (isUser) {
      return res.status(statusCode.OK).json({
        isPass: false,
        message: `아이디(${checkedId})가 이미 존재합니다.`,
      });
    } else {
      return res.status(statusCode.OK).json({
        isPass: true,
        message: `사용 가능한 아이디(${checkedId})입니다.`,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(statusCode.CREATED).end();
  } catch (err) {
    next(err);
  }
};

export const getToken = (req, res, next) => {
  try {
    const jwtToken = jwt.sign(req.user, process.env.JWT_SECRET, {
      expiresIn: '5d',
    });
    res.status(statusCode.OK).json({
      token: jwtToken,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(
      req.authorizedUser._id,
      '_id profileId name',
    );
    res.status(statusCode.OK).json({
      loginUser: {
        _id: user._id,
        name: user.name,
        profileId: user.profileId,
      },
    });
  } catch (error) {
    next(error);
  }
};

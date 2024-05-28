import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { generateOTP } from 'src/utils/functions';
import { UpdateUserDto } from './dto/update-user.dto';

interface IUser {
  email: string;
  phone_no: string;
}

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,

    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;
    const hashed_pass = await this.hashPassword(password);
    const token = generateOTP();
    const expires_at = new Date().setDate(
      new Date().getDate() + Number(process.env.OTP_EXPIRATION_DAYS),
    );

    await this.userModel.create({
      ...rest,
      password: hashed_pass,
      verification: {
        token: token,
        expiry: expires_at,
        isVerified: false,
      },
    });

    const logged_in_token = await this.generateToken({
      email: createUserDto.email,
      phone_no: createUserDto.phone_no,
    });

    return {
      message: 'User created successfully.',
      token: logged_in_token,
    };
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email: email });
  }

  async validateUser(loginDto: LoginUserDto) {
    const user_exists = await this.findByEmail(loginDto.email);
    if (!user_exists) {
      throw new NotFoundException('No user found with this email.');
    }

    const match_pass = await this.comparePassword(
      loginDto.password,
      user_exists.password,
    );
    if (!match_pass) {
      throw new UnauthorizedException('Please enter a valid password');
    }
    return user_exists;
  }

  async comparePassword(enteredPassword: string, dbPassword: string) {
    const match = await bcrypt.compare(enteredPassword, dbPassword);
    return match;
  }

  async login(loginDto: LoginUserDto) {
    const user = await this.validateUser(loginDto);
    const token = await this.generateToken({
      email: loginDto.email,
      phone_no: user.phone_no,
    });
    user.isLoggedIn = true;
    await user.save();
    return {
      data: {
        token: token,
        is_verified: user.verification.is_verified,
        user: user,
      },
      message: 'User logged in successfully',
    };
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
  async generateToken(user: IUser) {
    const token = await this.jwtService.signAsync(user);
    return token;
  }

  async logout(user_id: mongoose.Types.ObjectId) {
    await this.userModel.findByIdAndUpdate(user_id, { isLoggedIn: false });
    return {
      message: 'Logged out successfully.',
    };
  }

  async getProfile(authUser: User) {
    const user_exist = await this.userModel
      .findById(authUser._id)
      .select('-password');
    return { data: user_exist };
  }

  async updateProfile(
    id: mongoose.Types.ObjectId,
    updateUserDto: UpdateUserDto,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new UnprocessableEntityException('Please enter a valid id');
    }
    const user_exist = await this.userModel.findById(id);
    if (!user_exist) {
      throw new NotFoundException('No user found with this id');
    }
    const updated_user = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    );
    return {
      message: 'Profile updated successfully.',
      updated_user: updated_user,
    };
  }
}

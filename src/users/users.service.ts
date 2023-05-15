import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UserInfo } from './UserInfo';
import { EmailService } from 'src/email/email.service';
import * as uuid from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { DataSource, Repository } from 'typeorm';
import { ulid } from 'ulid';

@Injectable()
export class UsersService {
  constructor(
    private emailService: EmailService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {}
  async createUser(name: string, email: string, password: string) {
    const userExist = await this.checkUserExists(email);
    if (userExist) {
      throw new UnprocessableEntityException(
        '해당 이메일로는 가입할수 없습니다.',
      );
    }
    const signupVerifyToken = uuid.v1();
    await this.saveUser(name, email, password, signupVerifyToken);
    await this.senMemberJoinEmail(email, signupVerifyToken);
  }
  async verifyEmail(signupVerifyToken: string): Promise<string> {
    //:TODO
    // 1.DB에서 토큰으로 회원 가입 처리중인 유저가 있는지 조회하고 없다면 에러처림
    // 2.바로 로그인 상태가 되게 JWT 발급
    throw new Error('Method not Implement');
  }
  async login(email: string, password: string): Promise<string> {
    // TODO
    // 1. email, password를 가진 우저가 있는지 DB확인
    // 2. JWT 발급
    throw new Error('Method not implement');
  }

  async getUserInfo(userId: string): Promise<UserInfo> {
    throw new Error('Method not implement');
  }

  private async checkUserExists(emailAddress: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { email: emailAddress },
    });
    return user !== undefined;
  }
  private async saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const user = new UserEntity();
    user.id = ulid();
    console.log(user.id);
    user.name = name;
    user.email = email;
    user.password = password;
    user.signupVerifyToken = signupVerifyToken;
    await this.userRepository.save(user);
  }
  private async senMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }
}

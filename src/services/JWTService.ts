import {BindingScope, inject, injectable} from '@loopback/core';
import {TokenService} from '@loopback/authentication';
import {securityId, UserProfile} from '@loopback/security';
import {HttpErrors} from '@loopback/rest';
import {promisify} from 'util';
import {TokenServiceBindings} from '../keys';
import {repository} from '@loopback/repository';
import {UserRepository} from '../repositories';
import _ from 'lodash';
import {User} from '../models';

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

@injectable({scope: BindingScope.TRANSIENT})
export class JWTService implements TokenService {
  constructor(
    @repository(UserRepository)
    private userRepository: UserRepository,
    @inject(TokenServiceBindings.TOKEN_SECRET)
    private jwtSecret: string,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
    private jwtExpiresIn: string,
  ) {}

  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error generating token : userProfile is null',
      );
    }

    const userInfoForToken = await this.userRepository.findById(
      userProfile[securityId],
    );
    // Generate a JSON Web Token
    let token: string;
    try {
      token = await signAsync(
        _.omit(userInfoForToken, ['password']),
        this.jwtSecret,
        {
          expiresIn: Number(this.jwtExpiresIn),
        },
      );
    } catch (error) {
      throw new HttpErrors.Unauthorized(`Error encoding token : ${error}`);
    }

    return token;
  }

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : 'token' is null`,
      );
    }

    let userProfile: UserProfile;

    try {
      // decode user profile from token
      const decodedToken: User = await verifyAsync(token, this.jwtSecret);
      // don't copy over  token field 'iat' and 'exp', nor 'email' to user profile
      userProfile = Object.assign(
        {[securityId]: '', name: ''},
        {
          [securityId]: decodedToken.id,
          name: decodedToken.username,
          id: decodedToken.id,
        },
      );
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : ${error.message}`,
      );
    }
    return userProfile;
  }

  /*
   * Add other service methods here
   */
}

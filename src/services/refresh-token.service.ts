import {BindingScope, inject, injectable} from '@loopback/core';
import {UserProfile} from '@loopback/security';
import {repository} from '@loopback/repository';
import {RefreshTokenRepository} from '../repositories';
import {UserServiceService} from './user-service.service';
import {TokenService} from '@loopback/authentication';
import {RefreshToken, RefreshTokenRelations} from '../models';
import {promisify} from 'util';
import {v4 as uuid} from 'uuid';
import {HttpErrors} from '@loopback/rest';
import {RefreshTokenServiceBindings, TokenServiceBindings, UserServiceBindings} from '../keys';

import {RefreshTokenService as MyRefreshTokenService} from '../types';

import {TokenObject} from '@loopback/authentication-jwt';

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

@injectable({scope: BindingScope.TRANSIENT})
export class RefreshTokenService implements MyRefreshTokenService {
  constructor(
    @inject(RefreshTokenServiceBindings.REFRESH_SECRET)
    private refreshSecret: string,
    @inject(RefreshTokenServiceBindings.REFRESH_EXPIRES_IN)
    private refreshExpiresIn: string,
    @inject(RefreshTokenServiceBindings.REFRESH_ISSUER)
    private refreshIssuer: string,
    @repository(RefreshTokenRepository)
    public refreshTokenRepository: RefreshTokenRepository,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserServiceService,
    @inject(TokenServiceBindings.TOKEN_SERVICE) public jwtService: TokenService,
  ) {}

  /**
   * Generate a refresh token, bind it with the given user profile + access
   * token, then store them in redis db.
   */
  async generateToken(
    userProfile: UserProfile,
    token: string,
  ): Promise<TokenObject> {
    const data = {
      token: uuid(),
    };
    const refreshToken = await signAsync(data, this.refreshSecret, {
      expiresIn: Number(this.refreshExpiresIn),
      issuer: this.refreshIssuer,
    });
    const result = {
      accessToken: token,
      refreshToken: refreshToken,
    };
    await this.refreshTokenRepository.set(result.refreshToken, {
      userId: userProfile.id,
    });
    return result;
  }

  /*
   * Refresh the access token bound with the given refresh token.
   */
  async refreshToken(refreshToken: string): Promise<TokenObject> {
    try {
      if (!refreshToken) {
        throw new HttpErrors.Unauthorized(
          `Error verifying token : 'refresh token' is null`,
        );
      }

      const userRefreshData = await this.verifyToken(refreshToken);
      const user = await this.userService.findUserById(
        userRefreshData.userId.toString(),
      );
      const userProfile: UserProfile = this.userService.convertToUserProfile(
        user,
      );
      // create a JSON Web Token based on the user profile
      const token = await this.jwtService.generateToken(userProfile);

      return {
        accessToken: token,
      };
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : ${error.message}`,
      );
    }
  }

  /**
   * Verify the validity of a refresh token, and make sure it exists in backend.
   * @param refreshToken
   */
  async verifyToken(
    refreshToken: string,
  ): Promise<RefreshToken & RefreshTokenRelations> {
    try {
      await verifyAsync(refreshToken, this.refreshSecret);
      const userRefreshData = await this.refreshTokenRepository.get(
        refreshToken,
      );

      if (!userRefreshData) {
        throw new HttpErrors.Unauthorized(
          `Error verifying token : Invalid Token`,
        );
      }
      return userRefreshData;
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : ${error.message}`,
      );
    }
  }
}

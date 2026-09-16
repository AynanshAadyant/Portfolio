import SpotifyService from '../services/SpotifyService.js';
import ResponseFormatter from '../utils/ResponseFormatter.js';

export class SpotifyController {
  /**
   * Retrieves current playback and top tracks.
   */
  static async getNowPlaying(req, res, next) {
    try {
      const data = await SpotifyService.getNowPlaying();
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Retrieves top tracks.
   */
  static async getTopTracks(req, res, next) {
    try {
      const data = await SpotifyService.getTopTracks();
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Forces refresh of Spotify cache (Admin only).
   */
  static async sync(req, res, next) {
    try {
      const data = await SpotifyService.sync();
      return ResponseFormatter.success(res, data, 200);
    } catch (err) {
      next(err);
    }
  }
}

export default SpotifyController;

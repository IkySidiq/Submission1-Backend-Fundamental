const ClientError = require('./ClientError');
 
class InvariantError extends ClientError {
  constructor(message) {
    //*Super() meminta parameter berdasarkan constructor dari parent class yang kamu extends.
    super(message);
    this.name = 'InvariantError';
  }
}
 
module.exports = InvariantError;
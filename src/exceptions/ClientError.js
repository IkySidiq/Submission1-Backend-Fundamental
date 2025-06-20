//* Extends itu seperti meniru. ClientError membutuhkan method-method yang ada di dalam class Error
class ClientError extends Error {
  //* Untuk mengaktifkan constructor dari Error (atau parent class apa pun), kamu wajib menggunakan super(...), dan parameter yang dibutuhkan constructor-nya harus diberikan.
  constructor(message, statusCode = 400) {
    //* semua properti bawaan Error langsung terpasang di objek kamu. Langsung connect
    super(message); 
    this.statusCode = statusCode;
    this.name = 'ClientError'; //* Ini jadi mengoverride this.name yang ada di class Error.
    this.isClientError = true; //! Ini bisa dihapus karena di server.ext sudah digantikan
  }
}

module.exports = ClientError;

const ClientError = require('../../exceptions/ClientError');

class ExportsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postExportNotesHandler = this.postExportNotesHandler.bind(this);
  }

  async postExportNotesHandler(request, h) {
    try {
      this._validator.validateExportNotesPayload(request.payload);
      const message = {
        userId: request.auth.credentials.id,
        targetEmail: request.payload.targetEmail,
      };
      await this._service.sendMessage('export:notes', JSON.stringify(message));
      const res = h.response({
        status: 'success',
        message: 'Permintaan Anda dalam antrean',
      });
      res.code(201);
      return res;
    } catch (error) {
      if (error instanceof ClientError) {
        const res = h.response({
          status: 'fail',
          message: error.message,
        });
        res.code(error.statusCode);
        return res;
      }

      const res = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami',
      });
      res.code(500);
      console.error(error);
      return res;
    }
  }
}

module.exports = ExportsHandler;

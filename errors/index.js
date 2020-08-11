class error extends Error {
  constructor(errors, status, ...props) {
    super(...props);
    this.status = status;
    this.type = this.constructor.name;
    this.data = Array.isArray(errors) ? errors : [{ msg: errors }];
  }
}

module.exports = { error };

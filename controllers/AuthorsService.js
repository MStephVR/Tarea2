'use strict';
const { Store } = require('../utils/store');
const authorsDB = new Store('authors.json');
const booksDB = new Store('books.json');

exports.authorsGET = async () => authorsDB.all();

exports.authorsPOST = async (body) => {
  if (!body?.id) throw new Error('Missing author id');
  if (authorsDB.getById(body.id)) throw new Error('Author with this id already exists');
  authorsDB.upsert(body);
  return { status: 201, body: { ok: true } };
};

exports.authorsAuthorIdGET = async (authorId) => {
  const found = authorsDB.getById(authorId);
  return found ? found : { status: 404 };
};

exports.authorsAuthorIdPUT = async (body, authorId) => {
  if (!authorsDB.getById(authorId)) return { status: 404 };
  if (String(body.id) !== String(authorId)) return { status: 400, body: { error: 'Body.id must match path id' } };
  authorsDB.upsert(body);
  return { status: 200, body: { ok: true } };
};

exports.authorsAuthorIdDELETE = async (authorId) => {
  const hasBooks = booksDB.all().some(b => String(b.authorId) === String(authorId));
  if (hasBooks) return { status: 400, body: { error: 'Author has related books' } };
  const ok = authorsDB.delete(authorId);
  return ok ? { status: 204 } : { status: 404 };
};

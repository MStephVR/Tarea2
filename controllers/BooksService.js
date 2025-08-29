'use strict';
const { Store } = require('../utils/store');
const booksDB = new Store('books.json');
const authorsDB = new Store('authors.json');
const publishersDB = new Store('publishers.json');

function validateRelations(book) {
  if (!authorsDB.getById(book.authorId)) throw new Error('authorId does not exist');
  if (!publishersDB.getById(book.publisherId)) throw new Error('publisherId does not exist');
}

exports.booksGET = async () => booksDB.all();

exports.booksPOST = async (body) => {
  if (!body?.id) throw new Error('Missing book id');
  if (booksDB.getById(body.id)) throw new Error('Book with this id already exists');
  validateRelations(body);
  booksDB.upsert(body);
  return { status: 201, body: { ok: true } };
};

exports.booksBookIdGET = async (bookId) => {
  const found = booksDB.getById(bookId);
  return found ? found : { status: 404 };
};

exports.booksBookIdPUT = async (body, bookId) => {
  if (!booksDB.getById(bookId)) return { status: 404 };
  if (String(body.id) !== String(bookId)) return { status: 400, body: { error: 'Body.id must match path id' } };
  validateRelations(body);
  booksDB.upsert(body);
  return { status: 200, body: { ok: true } };
};

exports.booksBookIdDELETE = async (bookId) => {
  const ok = booksDB.delete(bookId);
  return ok ? { status: 204 } : { status: 404 };
};

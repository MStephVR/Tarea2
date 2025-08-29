'use strict';
const { Store } = require('../utils/store');
const publishersDB = new Store('publishers.json');
const booksDB = new Store('books.json');

exports.publishersGET = async () => publishersDB.all();

exports.publishersPOST = async (body) => {
  if (!body?.id) throw new Error('Missing publisher id');
  if (publishersDB.getById(body.id)) throw new Error('Publisher with this id already exists');
  publishersDB.upsert(body);
  return { status: 201, body: { ok: true } };
};

exports.publishersPublisherIdGET = async (publisherId) => {
  const found = publishersDB.getById(publisherId);
  return found ? found : { status: 404 };
};

exports.publishersPublisherIdPUT = async (body, publisherId) => {
  if (!publishersDB.getById(publisherId)) return { status: 404 };
  if (String(body.id) !== String(publisherId)) return { status: 400, body: { error: 'Body.id must match path id' } };
  publishersDB.upsert(body);
  return { status: 200, body: { ok: true } };
};

exports.publishersPublisherIdDELETE = async (publisherId) => {
  const hasBooks = booksDB.all().some(b => String(b.publisherId) === String(publisherId));
  if (hasBooks) return { status: 400, body: { error: 'Publisher has related books' } };
  const ok = publishersDB.delete(publisherId);
  return ok ? { status: 204 } : { status: 404 };
};

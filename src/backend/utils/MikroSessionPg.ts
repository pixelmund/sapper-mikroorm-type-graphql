/*
 *	PGStore - Connect storage in a PostgreSQL database.
 */

import type { EntityManager } from "@mikro-orm/core";
import { Store, SessionData } from "express-session";
import { em } from "../db/entityManager";

export interface ISession {
  id: string;
  pk: number;
  data: string;
  maxAge: number;
}

export class MikroStore extends Store {
  constructor(options: any) {
    //@ts-ignore
    super(options);
  }

  public connect() {
    this.emit("connect");
    return this;
  }

  public async destroy(sid: string, cb: ((err?: any) => void) | undefined) {
    try {
      const sess = await em.findOne<ISession>("Session", { id: sid });
      if (sess) {
        await em.removeAndFlush(sess);
      }
      if (cb) {
        return cb();
      }
    } catch (error) {
      console.log("destroy error");
      if (cb) {
        return cb(error);
      }
    }
  }

  public async get(
    sid: string,
    callback: (err: any, session?: SessionData | null | undefined) => void
  ) {
    try {
      const sess = await em.findOne<ISession>("Session", {
        id: sid,
      });
      if (!sess) {
        return callback(new Error("Session not found"));
      }
      callback(undefined, JSON.parse(sess.data));
    } catch (error) {
      callback(error);
    }
  }

  public async set(
    sid: string,
    sess: any,
    cb: ((err?: any) => void) | undefined
  ) {
    const session = em.create<ISession>("Session", {
      id: sid,
      data: JSON.stringify(sess),
      maxAge: this._getTTL(sess),
    });
    try {
      await em.persistAndFlush(session);
      if (cb) {
        return cb();
      }
    } catch (error) {
      if (cb) {
        return cb(error);
      }
    }
  }

  _getTTL = (sess: SessionData) => {
    let ttl;
    if (sess && sess.cookie && sess.cookie.expires) {
      let ms = Number(new Date(sess.cookie.expires)) - Date.now();
      ttl = Math.ceil(ms / 1000);
    } else {
      ttl = 86400000 * 14;
    }
    return ttl;
  };
}

import { Query } from "../connection";
import type { Event } from "../../types";

const all = (user_id: Event["user_id"]) => Query<Event[]>("SELECT * FROM events WHERE user_id=$1", [user_id]);

const one = (id: Event["id"], user_id: Event["user_id"]) =>
    Query<Event[]>("SELECT * FROM events WHERE user_id=$1 AND id=$2", [user_id, id]);

const create = ({ user_id, name, description, location, date_time }: Event) =>
    Query(
        "INSERT INTO events (user_id, name, description, location, date_time) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [user_id, name, description, location, date_time]
    );

const update = ({ name, description, location, date_time, user_id, id }: Event) =>
    Query("UPDATE events SET name=$1, description=$2, location=$3, date_time=$4 WHERE user_id=$5 AND id=$6", [
        name,
        description,
        location,
        date_time,
        user_id,
        id,
    ]);

const destroy = (id: Event["id"], user_id: Event["user_id"]) =>
    Query("DELETE FROM events WHERE user_id=$1 AND id=$2", [user_id, id]);

export default {
    all,
    one,
    create,
    update,
    destroy,
};

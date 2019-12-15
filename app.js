const axios = require('axios');
var pg = require('pg');
var conString = "postgres://fchhltfc:vcyFNRGGWwzAIXdQPiTMXcEXz5nYAYLV@satao.db.elephantsql.com:5432/fchhltfc";
const BASE_URL = 'https://jsonplaceholder.typicode.com';


const getandStore = async () => {
  try {

    var client = new pg.Client(conString);
    client.connect();

    const res = await axios.get(`${BASE_URL}/users`);
    const res_albm = await axios.get(`${BASE_URL}/albums`);
    const res_com = await axios.get(`${BASE_URL}/comments`);
    const res_pic = await axios.get(`${BASE_URL}/photos`);
    const res_post = await axios.get(`${BASE_URL}/posts`);
    const res_todo = await axios.get(`${BASE_URL}/todos`);

    const users = res.data;
    const albums = res_albm.data;
    const comments = res_com.data;
    const photos = res_pic.data;
    const posts = res_post.data;
    const todos = res_todo.data;


    for(var i = 0; i < users.length; i++) {
        var uid = users[i].id;
        var lat = users[i].address.geo.lat;
        var lng = users[i].address.geo.lng;
        var comp_name = users[i].company.name;
        var comp_catchPhrase = users[i].company.catchPhrase;
        var comp_bs = users[i].company.bs;

        var street = users[i].address.street;
        var suite =  users[i].address.suite;
        var city =  users[i].address.city;
        var zipcode =  users[i].address.zipcode;
    
        var addr =  users[i];
        var uname  = users[i].name;
        var uuname  = users[i].username;
        var uemail = users[i].email;
        var uphone = users[i].phone;
        var uwebsite = users[i].website;

       
/*insert to geoloc table */
        try {
            await client.query('INSERT INTO geoloc_pk (userid, lat ,lng)  VALUES ($1, $2, $3) RETURNING *', [uid , lat, lng])
        } catch (err) {
            console.log(err.stack)
        }

/*insert to company table */
        try {
            await client.query('INSERT INTO company_pk (userid, name, catchPhrase ,bs)  VALUES ($1, $2, $3, $4) RETURNING *', [uid , comp_name, comp_catchPhrase, comp_bs])
        } catch (err) {
            console.log(err.stack)
        }

/*insert to addresses table */
        try {
            var ress = await client.query('SELECT id FROM geoloc_pk WHERE userid = $1', [i+1])
            var geoid = ress.rows[0].id
        } catch (err) {
            console.log(err.stack)
        }

        try {
            await client.query('INSERT INTO addresses_pk (userid, street, suite ,city, zipcode, geolocid)  VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [uid , street, suite, city, zipcode, geoid])
        } catch (err) {
            console.log(err.stack)
        }

/*insert to user table */
        try {
            var resss = await client.query('SELECT id FROM company_pk WHERE userid = $1', [i+1])
            var comp_id = resss.rows[0].id
        } catch (err) {
            console.log(err.stack)
        }

        try {
            var ressss = await client.query('SELECT id FROM addresses_pk WHERE userid = $1', [i+1])
            var addr_id = ressss.rows[0].id
        } catch (err) {
            console.log(err.stack)
        }

        try {
            await client.query('INSERT INTO users_pk (userid, name, username, email, phone, website, addressid, companyid)  VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [uid , uname, uuname, uemail, uphone, uwebsite, addr_id, comp_id])
        } catch (err) {
            console.log(err.stack)
        }
      }

    for(var i = 0; i < albums.length; i++) {
        var id = albums[i].id;
        var usid = albums[i].userId;
        var title = albums[i].title;

        console.log(id, usid, title)

        try {
            await client.query('INSERT INTO albums_pk (id, userid ,title)  VALUES ($1, $2, $3) RETURNING *', [id , usid, title])
        } catch (err) {
            console.log(err.stack)
        }

    }

    for(var i = 0; i < posts.length; i++) {
        var id = posts[i].id;
        var title = posts[i].title;
        var body = posts[i].body;
        var userid = posts[i].userId;


        console.log(id, userid, title, body)

        try {
            await client.query('INSERT INTO posts_pk (id, userid, title, body )  VALUES ($1, $2, $3, $4) RETURNING *', [id , userid, title, body])
        } catch (err) {
            console.log(err.stack)
        }

    }

    for(var i = 0; i < comments.length; i++) {
        var id = comments[i].id;
        var postid = comments[i].postId;
        var name = comments[i].name;
        var email = comments[i].email;
        var body = comments[i].body;

        console.log(id, postid, name, email, body)

        try {
            await client.query('INSERT INTO commentss_pk (id, postid ,name, email, body )  VALUES ($1, $2, $3, $4, $5) RETURNING *', [id , postid, name, email, body])
        } catch (err) {
            console.log(err.stack)
        }

    }

    for(var i = 0; i < photos.length; i++) {
        var id = photos[i].id;
        var title = photos[i].title;
        var url = photos[i].url;
        var thumbnailurl = photos[i].thumbnailUrl;
        var albumid = photos[i].albumId;

        console.log(id, title, url, thumbnailurl, albumid)

        try {
            await client.query('INSERT INTO photos_pk (id, title, url, thumbnailurl, albumid )  VALUES ($1, $2, $3, $4, $5) RETURNING *', [id, title, url, thumbnailurl, albumid])
        } catch (err) {
            console.log(err.stack)
        }

    }

    for(var i = 0; i < todos.length; i++) {
        var id = todos[i].id;
        var title = todos[i].title;
        var completed = todos[i].completed;
        var userid = todos[i].userId;


        console.log(id, userid, title, completed)

        try {
            await client.query('INSERT INTO todos_pk (id, userid, title, completed)  VALUES ($1, $2, $3, $4) RETURNING *', [id, userid, title, completed])
        } catch (err) {
            console.log(err.stack)
        }

    }
    //return todos;

    client.end()
  } catch (e) {
    console.error(e);
  }
};


getandStore();



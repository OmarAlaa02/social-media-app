const db = require('../util/database');

class User {
    constructor(username, email, password) {
        this.username = username;
        this.password = password;
        this.email = email;
    }

    save() {
        return db.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
            [this.username, this.email, this.password]
        );
    }

    static findByEmail(email) {
        return db.execute('SELECT email FROM users WHERE users.email = ?', [email]);
    }

    static findById(id) {
        return db.execute('SELECT id FROM users WHERE users.id = ?', [id]);
    }

    static findByUsername(username) {
        return db.execute('Select username FROM users WHERE users.username = ?', [username]);
    }
}

module.exports = User;
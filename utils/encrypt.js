const crypto = require("crypto");

export function encrypt(text, password) {
	try {
		// Generate a random salt
		const salt = crypto.randomBytes(16);

		// Derive a key from the password using PBKDF2
		const key = crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256");

		// Generate a random IV (Initialization Vector)
		const iv = crypto.randomBytes(16);

		// Create the cipher object using the AES-256-CBC algorithm
		const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

		// Encrypt the text
		let encrypted = cipher.update(text, "utf8", "hex");
		encrypted += cipher.final("hex");

		// Combine the salt, IV, and encrypted data into a single string
		const result = salt.toString("hex") + iv.toString("hex") + encrypted;

		return {
			ok: true,
			message: "Encryption Successfull",
			key: result,
		};
	} catch (error) {
		return {
			ok: false,
			message: "Something wents wrong. Try again later.",
		};
	}
}

export function decrypt(encrypted, password) {
	try {
		// Extract the salt, IV, and encrypted data from the input string
		const salt = Buffer.from(encrypted.substr(0, 32), "hex");
		const iv = Buffer.from(encrypted.substr(32, 32), "hex");
		const encryptedData = encrypted.substr(64);

		// Derive the key using PBKDF2 with the extracted salt
		const key = crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256");

		// Create the decipher object using the AES-256-CBC algorithm
		const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

		// Decrypt the data
		let decrypted = decipher.update(encryptedData, "hex", "utf8");
		decrypted += decipher.final("utf8");

		return {
			ok: true,
			message: "Decryption Successfull",
			key: decrypted,
		};
	} catch (error) {
		return {
			ok: false,
			message: "Something wents wrong. Try again later.",
		};
	}
}

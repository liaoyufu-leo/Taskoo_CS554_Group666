const client = require('../utils/redis');
const { v4: uuidv4 } = require('uuid');
const Check = require('../lib/Check');
const dayjs = require('dayjs');
const nodemailer = require('nodemailer');
const Mail = require('nodemailer/lib/mailer');
const mailConfig = require('../utils/mail.json');
const { toCapitalize } = require('../utils/helpers');

/**
 * add the account info to register list (waitting for sign up)
 * use redis store the list
 * @param {{firstName: string, lastName: string, department: string, position: string}} accountInfo
 * @param {string} email the target email address (not the account email)
 * @returns {string} registerId
 */
const addToRegisterList = async (accountInfo, email) => {
	Check.firstName(accountInfo.firstName);
	Check.lastName(accountInfo.lastName);
	// check the validation of id
	Check.department(accountInfo.department);
	Check.position(accountInfo.position);

	const registerId = uuidv4();
	// TIPS the expire time (default is 1 hour)
	const expireTime = dayjs().add(1, 'hour').valueOf();
	await client.set(registerId, JSON.stringify(accountInfo), { PXAT: expireTime });

	// MODIFY the content
	await sendEmail({
		to: email,
		subject: 'Taskoo Registe Invitation',
		text: mailTemplate(accountInfo.firstName, registerId)
	});

	return registerId;
};

/**
 * TODO
 * send email to target address
 * @param {Mail.Options} content the email detail content
 */
const sendEmail = async mail => {
	const transporter = nodemailer.createTransport(mailConfig);
	mail.from = 'taskoo.cs554final@gmail.com';
	// send mail
	await transporter.sendMail(mail);
};

const mailTemplate = (firstName, registerId) => {
	return `
		Hi ${toCapitalize(firstName)},

		Welcome to Taskoo, please click the link below to start sign up your account.
		This link will expier in 1 hour.

		http://localhost:3000/#/account/signup/${registerId}

		Best,
		Taskoo Team
	`;
};

/**
 * get the info from resiter list accounding register id
 * @param {string} resiterId
 * @returns {Promise<null | {firstName: string, lastName: string, department: string, position: string}>}
 */
const getRegisterInfo = async registerId => {
	Check._id(registerId);
	const registerInfo = await client.get(registerId);
	return registerInfo ? JSON.parse(registerInfo) : null;
};

module.exports = {
	addToRegisterList,
	getRegisterInfo
};

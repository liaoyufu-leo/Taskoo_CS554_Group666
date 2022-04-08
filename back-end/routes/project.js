const { createProject } = require('../data/project');
const { Project } = require('../lib');

const router = require('express').Router();

router.post('/create', async (req, res) => {
	const { _id, bucket } = req.session.accountInfo;

	let newProject;
	try {
		newProject = new Project({ ...req.body, manager: _id });
	} catch (error) {
		return res.status(400).json({ code: 400, message: error?.message ?? error });
	}

	try {
		const message = await createProject(newProject, bucket);
		res.json({ code: 200, message });
	} catch (error) {
		res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

module.exports = router;
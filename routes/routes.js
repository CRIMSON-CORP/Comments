const router = require("express").Router();
const { app } = require("../server");
const { DATABASE } = require("../db");
const bodyParser = require("body-parser");
const TimeAgo = require("javascript-time-ago");
const en = require("javascript-time-ago/locale/en.json");
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-us");
router.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
router.use(bodyParser.json());

router.get("/comments", async (_, res) => {
    const data = await DATABASE().SELECTALL();
    data.map((d) => (d.date = timeAgo.format(parseInt(d.date))));
    res.send(JSON.stringify({ data }));
});

router.post("/post_comment", async (req, res) => {
    const { name, comment } = req.body;
    await DATABASE().INSERT(name, comment);
    res.send(JSON.stringify({ success: true }));
});

router.get("/admin", (_, res) => {
    res.redirect("/auth.html");
});

router.post("/auth", async (req, res) => {
    const { username, password } = req.body;
    const [data] = await DATABASE().AUTHENTICATE(username, password);
    if (data === null || data === undefined) {
        return res.send(JSON.stringify({ success: false, message: "No such Admin Exist!" }));
    }
    if (data.password.trim() === password.trim()) {
        res.send(JSON.stringify({ success: true, message: "Signed in successfully!" }));
        return;
    } else {
        return res.send(JSON.stringify({ success: false, message: "Incorrect password!" }));
    }
});

router.get("/all_comments", async (req, res) => {
    let comments = await DATABASE().SELECTALL();
    let approved = await DATABASE().SELECTALL_APPROVED();
    if (comments && approved) {
        comments.map((d) => (d.date = timeAgo.format(parseInt(d.date))));
        approved.map((d) => (d.date = timeAgo.format(parseInt(d.date))));
        res.send(JSON.stringify({ success: true, data: [comments, approved] }));
    } else {
        res.send(JSON.stringify({ success: false }));
    }
});

router.get("/approved_comments", async (req, res) => {
    const data = await DATABASE().SELECTALL_APPROVED();
    data.map((d) => (d.date = timeAgo.format(parseInt(d.date))));
    res.send(JSON.stringify({ data }));
});

router.post("/approve_comment", async (req, res) => {
    const { id } = req.body;
    const data = await DATABASE().APPROVE(id);
    if (data) {
        res.send(JSON.stringify({ success: true }));
    } else {
        res.send(JSON.stringify({ success: false }));
    }
});
router.post("/unapprove_comment", async (req, res) => {
    const { id } = req.body;
    const data = await DATABASE().UNAPPROVE(id);
    if (data) {
        res.send(JSON.stringify({ success: true }));
    } else {
        res.send(JSON.stringify({ success: false }));
    }
});
router.delete("/delete_comment", async (req, res) => {
    const { id } = req.body;
    const data = await DATABASE().DELETE(id);
    if (data) {
        res.send(JSON.stringify({ success: true }));
    } else {
        res.send(JSON.stringify({ success: false }));
    }
});

module.exports = router;

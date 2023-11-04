const URL = require('../model/url');
const dns = require('node:dns');
const util = require('node:util');

/**
 * Sends the index.html file as the response for the home route.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {undefined} The function does not return anything.
 */
const home = async (req, res) => {
    res.sendFile(process.cwd() + '/src/views/index.html');
};

/**
 * Handles the creation of a new URL.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise} - A promise that resolves to the result of the URL creation.
 */
const newUrl = async (req, res) => {
    const url = req.body.url;

    try {
        const lookup = util.promisify(dns.lookup);
        const { address } = await lookup(url);

        if (url.includes('https://')) {
            const findOne = await URL.findOne({ original_url: url });
            const findAll = await URL.find();

            if (!findOne) {
                const newUrl = new URL({
                    original_url: url,
                    short_url: findAll.length + 1,
                });
                await newUrl.save();

                res.json({
                    original_url: newUrl.original_url,
                    short_url: newUrl.short_url,
                });
            } else {
                res.json({
                    original_url: findOne.original_url,
                    short_url: findOne.short_url,
                });
            }
        } else {
            res.json({ error: 'invalid url' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json('Server error');
    }
};

/**
 * Retrieves the original URL associated with a given short URL.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>} - Redirects to the original URL if found, otherwise returns an error message.
 */
const getShortUrl = async (req, res) => {
    const shortUrlParam = req.params.short_url;
    try {
        const url = await URL.findOne({ short_url: shortUrlParam });
        if (!url) {
            res.status(400).json({ error: 'Wrong format' });
            return;
        }
        res.redirect(url.original_url);
    } catch (error) {
        console.error(error.message);
        res.send(error.message);
    }
};

module.exports = { newUrl, getShortUrl, home };

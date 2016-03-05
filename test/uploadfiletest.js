'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const assert = require('assert');
const ImageOptim = require('../index');

function assertIsJPEGBuffer(buf) {
    assert(Buffer.isBuffer(buf));
    assert(buf.length >= 200);
    assert.equal(buf[0], 0xFF);
    assert.equal(buf[1], 0xD8);
    assert.equal(buf[2], 0xFF);
}

describe('ImageOptim API', function() {
    const sourceImagePath = path.join(__dirname, 'test.png');
    const im = new ImageOptim();

    it('Saves to a file', function() {
        fs.statSync(sourceImagePath);

        const tempFilePath = path.join(os.tmpdir(), crypto.randomBytes(16).toString('hex') + '.jpg');
        return im.compress({})
            .file(sourceImagePath)
            .save(tempFilePath)
            .then(function(nothing) {
                assertIsJPEGBuffer(fs.readFileSync(tempFilePath));
                fs.unlink(tempFilePath);
                fs.statSync(sourceImagePath);
                assert.equal('undefined', typeof nothing);
            });
    });

    it('Saves to a buffer', function() {
        fs.statSync(sourceImagePath);

        return im.compress({})
            .file(sourceImagePath)
            .then(function(buf) {
                fs.writeFileSync('/tmp/jo.jpg', buf);
                fs.statSync(sourceImagePath);
                assertIsJPEGBuffer(buf);
            });
    });
});

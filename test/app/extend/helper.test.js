'use strict';

const { app, assert } = require('egg-mock/bootstrap');

const testData = require('../../data.json')

describe('=====> extend/helper', () => {

    describe('myHash()', () => {
        it('myHash(testData.hashContent) = testData.hashResult', () => {
            const ctx = app.mockContext()
            assert(ctx.helper.myHash(testData.hashContent) === testData.hashResult);
        });
    });
});

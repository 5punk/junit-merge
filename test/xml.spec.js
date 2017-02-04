var chai = require('chai')
const fs = require('fs')
var junitMerge = require('../lib/index.js')
var should = chai.should() // eslint-disable-line no-unused-vars
var expect = chai.expect // eslint-disable-line no-unused-vars
chai.use(require('chai-xsd-schema'))

describe('XML Handling', function () {
  describe('getTestsuites()', function () {
    it('should  return a testsuite', function (done) {
      junitMerge.getTestsuites('./test/fixtures/1.xml', function (err, res) {
        if (err) { throw err }
        res.should.have.string('testsuite name')
        done()
      })
    })

    it('should return 1 testsuites', function () {
      junitMerge.getTestsuites('./test/fixtures/1.xml', function (err, res) {
        if (err) {
          throw err
        }
        junitMerge.testsuiteCount.should.equal(1)
      })
    })

    it('should return 1 testsuite', function () {
      junitMerge.getTestsuites('./test/fixtures/testcase-1.xml', function (err, res) {
        if (err) {
          throw err
        }
        junitMerge.testsuiteCount.should.equal(1)
      })
    })

    it('should return 2 testsuites', function () {
      junitMerge.getTestsuites('./test/fixtures/3.xml', function (err, res) {
        if (err) {
          throw err
        }
        junitMerge.testsuiteCount.should.equal(2)
      })
    })

    it('should return No tests found', function () {
      junitMerge.mergeFiles(['./test/fixtures/empty.xml'], function (err, res) {
        if (err) {
          err.should.equal('No tests found')
        } else {
          res.should.equal('This should error')
        }
      })
    })

    it('should return merged xml file', function () {
      junitMerge.mergeFiles(['./test/fixtures/1.xml', './test/fixtures/3.xml'], function (err, res) {
        if (err) {
          throw err
        }
        res.length.should.equal(852)
      })
    })

    it('should return File not found', function () {
      junitMerge.getTestsuites('./test/fixtures/12.xml', function (err, res) {
        if (err) {
          err.should.equal('File not found')
        } else {
          res.should.equal(null)
        }
      })
    })

    it('Passes with valid input and valid schema', function () {
      var schema = fs.readFileSync('test/fixtures/JUnit.xsd', {
        encoding: 'utf8'
      })

      var xml = fs.readFileSync('merged-test-results.xml', {
        encoding: 'utf8'
      })

      expect(xml).to.be.validXML(schema)
    })
  })
})

const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const config = require("./config.js");
const converter = require('json-2-csv');
const csvToJson = require('convert-csv-to-json');
const fs = require("fs");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.route("/")

    .get(function(req,res) {
        let json =   csvToJson.fieldDelimiter(',').utf8Encoding().getJsonFromCsv("DimensionModel.csv");
    res.send(json);
    })

    .post(function(req,res) {
        let json = csvToJson.fieldDelimiter(',').utf8Encoding().getJsonFromCsv("DimensionModel.csv");
        let iData = {
            ServiceIdentiferPrimary: req.body.sip,
            ServiceIdentiferSecondary: req.body.sis,
            ServiceIdentiferTertiary: req.body.sit,
            ServiceIdentiferQuaternary: req.body.siq,
            ServiceProviderName: req.body.spn,
            SPExtinctFeature1: req.body.spef1,
            SPExtinctFeature2: req.body.spef2,
            SPExtinctFeature3: req.body.spef3,
            SPExtinctFeature4: req.body.spef4,
            AddressPrimary: req.body.addp,
            AddresssSecondary: req.body.adds,
            ServiceIssueDate: req.body.sid,
            ServiceExpiryDate: req.body.sed,
            ServiceFees1: req.body.sf1,
            ServiceFees2: req.body.sf2,
            ServiceFees3: req.body.sf3,
            CreationDate: req.body.cd,
            ModifiedDate: req.body.md,
            CurrentIndicator: req.body.ci,
            IsDeleted: req.body.isd,
            HashDiffDistiguisher: req.body.hdd
        }
        json.push(iData);
        converter.json2csv(json, (err, csv) => {
            if (err) {
              throw err
            }
          
            // print CSV string
            fs.writeFileSync('DimensionModel.csv', csv)
          })
        res.sendStatus("200");
    })
;

app.route("/payment")

    .post(function(req,res) {
        let t_id =  req.body.transId;
        let t_date = req.body.transDate;
        let unit = req.body.unit;
        let quantity = req.body.quantity;
        let price = req.body.price;
        let currency = req.body.currency;
        let amount = req.body.amount;
        let mode = req.body.mode;
        let c_date = req.body.c_date;
        let m_date = req.body.m_date;
        let isdel = req.body.isdel;
        let hashd = req.body.hashd;
        let sql = `insert into service_payment values(?,?,?,?,?,?,?,?,?,?,?,?)`;
        let data = [t_id,t_date,unit,quantity,price,currency,amount,mode,c_date,m_date,isdel,hashd];
        let connection = mysql.createConnection(config);
        connection.query(sql,data,function(err,results,fields){
            if(err){
                res.send(err);
            }
            res.send("Success! "+results.affectedRows +" row(s) affected.");
        }); 
        connection.end();
    })

    .get(function(req,res) {
        let connection = mysql.createConnection(config);
        let sql = `SELECT * FROM service_payment`;
        connection.query(sql,function(err,results,fields) {
            if(err){
                res.send(err);
            }
            converter.json2csv(results, (err, csv) => {
                if (err) {
                  throw err
                }
              
                // print CSV string
                fs.writeFileSync('payments.csv', csv)
              })
            res.send(results);
        });
        connection.end();
    })
;


app.route("/transaction")

    .post(function(req,res) {
        let t_id =  req.body.transId;
        let t_date = req.body.transDate;
        let f_date = req.body.f_date;
        let f_date1 = req.body.f_date1;
        let f_date2 = req.body.f_date2;
        let f_date3 = req.body.f_date3;
        let f_value = req.body.f_value;
        let f_value2 = req.body.f_value2;
        let f_value3 = req.body.f_value3;
        let f_value4 = req.body.f_value4;
        let f_state = req.body.f_state;
        let c_date = req.body.c_date;
        let m_date = req.body.m_date;
        let isdel = req.body.isdel;
        let hashd = req.body.hashd;

        let sql = `insert into service_transaction values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        let data = [t_id,t_date,f_date, f_date1, f_date2, f_date3, f_value, f_value2, f_value3, f_value4, f_state,c_date,m_date,isdel,hashd];
        let connection = mysql.createConnection(config);
        connection.query(sql,data,function(err,results,fields){
            if(err){
                res.send(err);
            }
            res.send("Success! "+results.affectedRows +" row(s) affected.");
        }); 
        connection.end();
    })

    .get(function(req,res) {
        let connection = mysql.createConnection(config);
        let sql = `SELECT * FROM service_transaction`;
        connection.query(sql,function(err,results,fields) {
            if(err){
                res.send(err);
            }
            converter.json2csv(results, (err, csv) => {
                if (err) {
                  throw err
                }
              
                // print CSV string
                fs.writeFileSync('transaction.csv', csv)
              })
            res.send(results);
        });
        connection.end();
    })
;

app.listen(process.env.PORT || 3000,function() {
    console.log("Server is running on port 3000");
})
const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const cors = require('cors');
const db = require('./configs/connect.database');
const host = "0.0.0.0";
const port = 5000;
const accounts = require("./model/accounts")
const timetables = require("./model/timetables")
const marktables = require("./model/marktables")
const marknks = require("./model/marknk")
const middleware = require("./middleware/account.middware")
const ngoaingu = require("./university/newSFL")
const quocte = require("./university/newIS")
const congnghiep = require("./university/TNUT")
const tnu = require('sscores');
const md5 = require('md5');
const request = require('request');
const cheerio = require('cheerio');
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
app.use(cors());
//connect MongoDB
db.connect()
// Setup RE
const NodeRSA = require('node-rsa');
const {
    update
} = require('./model/accounts');
const keyPublic = new NodeRSA('-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIIBOgIBAAJBAMGGf41b5BmnBc+oRRyasFUgRPxMFcJeVxWYPv3bh5cv5hfPkJcm\n' +
    'nG4ZjoLIRThB6W4LW3N60zqXGb+UGkBlcFkCAwEAAQJAfWeOmCeHtCfLWDkOL+79\n' +
    'fOwgR+113DIN9GxnxVDQmGLMrldWN+G/O5i2jD82sfani/BshEm0yfT48WO3/ayy\n' +
    'AQIhAOr+wAurKc8OF665ijMq2yUc2B5fDaQBueblji/cHIWRAiEA0tLSS3eMr33o\n' +
    'KFWKiXMAnkCccAyBGD7CzWWnPhO4ukkCIFeggxBW1RJGmQIoYaZO1sTyCozYuQdt\n' +
    'NVsqQmkKVQBhAiBJjBCfETq8MjFeeNEWuE775lBs6n/SxHpTC2Z3youEOQIhAKOQ\n' +
    'yNUB6hfga/0DEGOhZyfbexoYHx0ognxy8TPz6bBP\n' +
    '-----END RSA PRIVATE KEY-----');
app.post('/api/get-token', async function (req, res) {
    let getAll = await accounts.find()
    let arr = []
    for (let i = 0; i < getAll.length; i++) {
        arr.push(getAll[i].token)
    }
    res.status(200).json({
        data: arr
    })
})
app.post('/api/get-lich', middleware.getLich, async function (req, res) {
    let token = req.body.token;
    let check = await accounts.findOne({
        token: token
    })
    if (check !== null) {
        let username = check.code_student;
        let password = keyPublic.decrypt(check.password, 'utf8');
        let codeSchool = username[0] + username[1] + username[2];
        let codeSchool2 = username[0] + username[1] + username[2] + username[3] + username[4];
        let school;
        let hostname;
        let ictu
        switch (codeSchool) {
            case "DTZ":
                ictu = tnu.Open("TNUS");
                school = "TNUS"
                hostname = "sinhvien.tnus.edu.vn"
                //DH Khoa học
                break;
            case "DTS":
                console.log("hihi")
                ictu = tnu.Open("TUE");
                school = "TUE"
                hostname = "qlsv.dhsptn.edu.vn"
                break;
                //DH Su Pham
            case "DTN":
                ictu = tnu.Open("TUAF");
                school = "TUAF"
                hostname = "hdnk.tuaf.edu.vn"
                //NongLam
                break;
            case "DTE":
                console.log("done")
                ictu = tnu.Open("TUEBA");
                school = "TUEBA";
                hostname = "sinhvien.tueba.edu.vn";
                break;
            case "DTY":
                ictu = tnu.Open("TUMP");
                school = "TUMP";
                //YDUOC
                hostname = "hoatdongngoaikhoa.tump.edu.vn";
                break;
            default:
                ictu = tnu.Open("ICTU");
                school = "ICTU"
                hostname = "sinhvien.ictu.edu.vn"
        }
        if (username[0] == "K") {
            try {
                let get_lichthi = congnghiep.getLichThiCN(username).then(async lichthi => {
                    let get_lichhoc = congnghiep.getLichHocCN(username).then(async lichhoc => {
                        if (lichhoc.length >= 0 && lichthi.length >= 0) {
                            let temparr = {
                                timetable: lichhoc,
                                examtable: lichthi
                            }
                            res.status(200).json({
                                statuscode: 200,
                                message: "Lấy danh sách lịch thành công!",
                                data: temparr,
                            })
                        } else {
                            res.status(400).json({
                                statuscode: 400,
                                message: "Server nhà trường đang bảo trì, vui lòng thử lại sau!"
                            })
                        }
                    })
                })
            } catch (e) {
                res.status(400).json({
                    statuscode: 400,
                    message: "Server nhà trường đang bảo trì, vui lòng thử lại sau!"
                })
            }
        } else if (codeSchool == "DTF") {
            try {
                let get_lichhoc = ngoaingu.getTimeTableNN(username, md5(password)).then(async lichhoc => {
                    if (lichhoc.length >= 0) {
                        let temparr = {
                            timetable: lichhoc,
                            examtable: []
                        }
                        res.status(200).json({
                            statuscode: 200,
                            message: "Lấy danh sách lịch thành công!",
                            data: temparr
                        })
                    } else {
                        res.status(400).json({
                            statuscode: 400,
                            message: "Server nhà trường đang bảo trì, vui lòng thử lại sau!"
                        })
                    }
                })
            } catch (e) {
                res.status(400).json({
                    statuscode: 400,
                    message: "Server nhà trường đang bảo trì, vui lòng thử lại sau!"
                })
            }
        } else if (codeSchool == "DTQ") {
            try {
                let get_lichhoc = quocte.getTimeTableQT(username, md5(password)).then(async lichhoc => {
                    if (lichhoc.length >= 0) {
                        let temparr = {
                            timetable: lichhoc,
                            examtable: []
                        }
                        res.status(200).json({
                            statuscode: 200,
                            message: "Lấy danh sách lịch thành công!",
                            data: temparr
                        })
                    } else {
                        res.status(400).json({
                            statuscode: 400,
                            message: "Server nhà trường đang bảo trì, vui lòng thử lại sau!"
                        })
                    }
                })
            } catch (e) {
                res.status(400).json({
                    statuscode: 400,
                    message: "Server nhà trường đang bảo trì, vui lòng thử lại sau!"
                })
            }
        } else if (codeSchool2 == 'DTC19' || codeSchool2 == 'DTC20') {
            try {
                ictu.Login(username, password).then(function (session) {
                    if (session) {
                        let semesterarr = [];
                        ictu.GetSemestersOfStudy().then(async function (resp) {
                            if (resp.length > 0) {
                                for (let i = 0; i < resp.length; i++) {
                                    if (resp[i].TenKy == '2_2020_2021') {
                                        semesterarr.push(resp[i])
                                    }
                                }
                                ictu.GetTimeTableOfStudy(semesterarr[0].MaKy).then(async function (rs) {
                                    ictu.GetTimeTableOfExam(semesterarr[0].MaKy).then(async function (rse) {
                                        if (rs.Entries.length >= 0 && rse.Entries.length >= 0) {
                                            let schedule = rs.Entries;
                                            let scheduleEx = rse.Entries;
                                            let temparr = {
                                                timetable: schedule,
                                                examtable: scheduleEx
                                            }
                                            res.status(200).json({
                                                statuscode: 200,
                                                message: "Lấy danh sách lịch thành công!",
                                                data: temparr
                                            });
                                        } else {
                                            res.status(400).json({
                                                statuscode: 400,
                                                message: "Server nhà trường đang bảo trì, vui lòng thử lại sau!"
                                            })
                                        }
                                    })
                                })
                            } else {
                                res.status(400).json({
                                    statuscode: 400,
                                    message: "Server nhà trường đang bảo trì, vui lòng thử lại sau!"
                                })
                            }
                        })
                    } else {
                        res.status(400).json({
                            statuscode: 400,
                            message: "Sai tài khoản hoặc mật khẩu, vui lòng thử lại!"
                        })
                    }
                })
            } catch (ex) {
                res.status(400).json({
                    statuscode: 400,
                    message: "Server nhà trường đang bảo trì, vui lòng thử lại sau!"
                })
            }
        } else {
            try {
                ictu.Login(username, password).then(function (session) {
                    if (session) {
                        let semesterarr = [];
                        ictu.GetSemestersOfStudy().then(async function (resp) {
                            if (resp.length > 0) {
                                for (let i = 0; i < resp.length; i++) {
                                    if (resp[i].IsNow == true) {
                                        semesterarr.push(resp[i]);
                                        semesterarr.push(resp[i + 1]);
                                    }
                                }
                                ictu.GetTimeTableOfStudy(semesterarr[0].MaKy).then(async function (rs) {
                                    ictu.GetTimeTableOfExam(semesterarr[0].MaKy).then(async function (rse) {
                                        if (rs.Entries.length >= 0 && rse.Entries.length >= 0) {
                                            let schedule = rs.Entries;
                                            let scheduleEx = rse.Entries;
                                            let temparr = {
                                                timetable: schedule,
                                                examtable: scheduleEx
                                            }
                                            res.status(200).json({
                                                statuscode: 200,
                                                message: "Lấy danh sách lịch thành công!",
                                                data: temparr
                                            });
                                        } else {
                                            res.status(400).json({
                                                statuscode: 400,
                                                message: "Server nhà trường đang bảo trì, vui lòng thử lại sau!"
                                            })
                                        }
                                    })
                                })
                            } else {
                                res.status(400).json({
                                    statuscode: 400,
                                    message: "Server nhà trường đang bảo trì, vui lòng thử lại sau!"
                                })
                            }
                        })
                    } else {
                        res.status(400).json({
                            statuscode: 400,
                            message: "Sai tài khoản hoặc mật khẩu, vui lòng thử lại!"
                        })
                    }
                })
            } catch (e) {
                res.status(400).json({
                    statuscode: 400,
                    message: "Server nhà trường đang bảo trì, vui lòng thử lại sau!"
                })
            }
        }
    } else {
        res.status(401).json({
            statuscode: 401,
            message: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!"
        })
    }
})
app.post('/api/get-diem', middleware.getLich, async function (req, res) {
    let token = req.body.token;
    let check = await accounts.findOne({
        token: token
    })
    if (check != null) {
        let username = check.code_student;
        let password = keyPublic.decrypt(check.password, 'utf8');
        let codeSchool = username[0] + username[1] + username[2];
        let school;
        let hostname;
        let ictu
        let check_diem = await marktables.findOne({
            id_student: username
        })
        switch (codeSchool) {
            case "DTZ":
                ictu = tnu.Open("TNUS");
                school = "TNUS"
                hostname = "sinhvien.tnus.edu.vn"
                //DH Khoa học
                break;
            case "DTS":
                console.log("hihi")
                ictu = tnu.Open("TUE");
                school = "TUE"
                hostname = "qlsv.dhsptn.edu.vn"
                break;
                //DH Su Pham
            case "DTN":
                ictu = tnu.Open("TUAF");
                school = "TUAF"
                hostname = "hdnk.tuaf.edu.vn"
                //NongLam
                break;
            case "DTE":
                console.log("done")
                ictu = tnu.Open("TUEBA");
                school = "TUEBA";
                hostname = "sinhvien.tueba.edu.vn";
                break;
            case "DTY":
                ictu = tnu.Open("TUMP");
                school = "TUMP";
                //YDUOC
                hostname = "hoatdongngoaikhoa.tump.edu.vn";
                break;
            default:
                ictu = tnu.Open("ICTU");
                school = "ICTU"
                hostname = "sinhvien.ictu.edu.vn"
        }
        if (username[0] == "K") {
            try {
                let get_diem = congnghiep.getDiemCN(username, password).then(async diem => {
                    res.status(200).json({
                        statuscode: 200,
                        message: "Lấy danh sách điểm thành công!",
                        data: diem
                    });
                })
            } catch (e) {
                res.status(400).json({
                    message: "Server nhà trường đang bảo trì, vui lòng thử lại sau!"
                })
            }
        } else if (codeSchool == "DTF") {
            try {
                let get_diem = ngoaingu.getMarkTableNN(username, md5(password)).then(async function (diem) {
                    res.status(200).json({
                        statuscode: 200,
                        message: "Lấy danh sách điểm thành công!",
                        data: diem
                    });
                })
            } catch (e) {
                res.status(400).json({
                    statuscode: 400,
                    message: "Server nhà trường đang bảo trì, vui lòng thử lại sau!",
                });
            }
        } else if (codeSchool == "DTQ") {
            try {
                let get_diem = quocte.getMarkTableQT(username, md5(password)).then(async diem => {
                    res.status(200).json({
                        statuscode: 200,
                        message: "Lấy danh sách điểm thành công!",
                        data: diem
                    });
                })
            } catch (e) {
                res.status(400).json({
                    statuscode: 400,
                    message: "Server nhà trường đang bảo trì, vui lòng thử lại sau!",
                });
            }
        } else {
            try {
                ictu.Login(username, password).then(function (session) {
                    if (session) {
                        ictu.GetMarkTable().then(async function (data) {
                            let MarkTable = data;
                            for (let i = 0; i < MarkTable[0].entries.length; i++) {
                                MarkTable[0].entries[i] = {
                                    "mamon": MarkTable[0].entries[i].mamon,
                                    "temon": MarkTable[0].entries[i].temon,
                                    "sotc": MarkTable[0].entries[i].sotc,
                                    "chuyencan": MarkTable[0].entries[i].cc,
                                    "thi": MarkTable[0].entries[i].thi,
                                    "tkhp": MarkTable[0].entries[i].tkhp,
                                    "diemchu": MarkTable[0].entries[i].diemchu
                                }
                            }
                            res.status(200).json({
                                statuscode: 200,
                                message: "Lấy danh sách điểm thành công!",
                                data: MarkTable[0]
                            });
                        })
                    } else {
                        res.status(400).json({
                            statuscode: 400,
                            message: "Sai tài khoản hoặc mật khẩu, vui lòng thử lại!"
                        })
                    }
                })
            } catch (ex) {
                res.status(400).json({
                    statuscode: 400,
                    message: "Server nhà trường đang bảo trì, vui lòng thử lại sau!",
                });
            }

        }
    } else {
        res.status(401).json({
            statuscode: 401,
            message: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!"
        })
    }
})
app.post('/api/get-ngoai-khoa', middleware.getLich, async function (req, res) {
    let token = req.body.token
    let check = await accounts.findOne({
        token: token
    })
    if (check !== null) {
        let username = check.code_student;
        let codeSchool = username[0] + username[1] + username[2];
        let hostname;
        switch (codeSchool) {
            case "DTZ":
                hostname = "sinhvien.tnus.edu.vn"
                //DH Khoa học
                break;
            case "DTS":
                hostname = "qlsv.dhsptn.edu.vn"
                break;
                //DH Su Pham
            case "DTN":
                hostname = "hdnk.tuaf.edu.vn"
                //NongLam
                break;
            case "DTE":
                hostname = "sinhvien.tueba.edu.vn";
                break;
            case "DTY":
                //YDUOC
                hostname = "hoatdongngoaikhoa.tump.edu.vn";
                break;
            case "DTF":
                //NN
                hostname = "qldvsfl.tnu.edu.vn";
                break;
            case "DTQ":
                hostname = "hdnk.istn.edu.vn";
                break;
            default:
                hostname = "sinhvien.ictu.edu.vn"
        }
        if (username[0] == "K") {
            hostname = "qlsv.tnut.edu.vn"
        }
        var options = {
            'method': 'POST',
            'url': 'https://api.dhdt.vn/activity/student-score',
            'headers': {
                'hostname': hostname,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "ids": username
            })
        };
        request(options, async function (error, response) {
            try {
                let tp6 = JSON.parse(response.body);
                for (let j = 0; j < tp6.info.list.length; j++) {
                    tp6.info.list[j].idn = parseInt(tp6.info.list[j].idn);
                }
                res.status(200).json({
                    statuscode: 200,
                    message: "Lấy danh sách điểm ngoại khóa thành công!",
                    data: {
                        total: tp6.info.total,
                        waiting: tp6.info.waiting,
                        entries: tp6.info.list
                    }
                });
            } catch (ex) {
                res.status(400).json({
                    statuscode: 400,
                    message: "Server nhà trường đang bảo trì, vui lòng thử lại sau!"
                })
            }
        })
    } else {
        res.status(401).json({
            statuscode: 401,
            message: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!"
        })
    }
})
app.post('/api/save-lich', middleware.getLich, async function (req, res) {
    let token = req.body.token;
    let check = await accounts.findOne({
        token: token
    })
    if (check !== null) {
        let username = check.code_student;
        let timetb = new timetables({
            id_student: username,
            timetable: req.body.timetable,
            examtable: req.body.examtable
        });
        let check_lich = await timetables.findOne({
            id_student: username
        })
        if (check_lich == null) {
            await timetb.save();
            res.status(200).json({
                message: "Saved successfully"
            })
        } else {
            await timetables.deleteOne({id_student: username})
            await timetb.save();
            res.status(200).json({
                message: "Delete and save successfully"
            })
        }
    } else {
        res.status(401).json({
            statuscode: 401,
            message: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!"
        })
    }
})
app.post('/api/save-diem', middleware.getLich, async function (req, res) {
    let token = req.body.token;
    let check = await accounts.findOne({
        token: token
    })
    if (check != null) {
        let username = check.code_student;
            let marks = new marktables({
                id_student: username,
                tongsotc: req.body.tongsotc,
                sotctuongduong: req.body.sotctuongduong,
                stctln: req.body.stctln,
                dtbc: req.body.dtbc,
                dtbcqd: req.body.dtbcqd,
                somonkhongdat: req.body.somonkhongdat,
                sotckhongdat: req.body.sotckhongdat,
                dtbxltn: req.body.dtbxltn,
                dtbmontn: req.body.dtbmontn,
                entries: req.body.entries
            });
            let check_diem = await marktables.findOne({
                id_student: username
            })
            if (check_diem == null) {
                await marks.save();
                res.status(200).json({
                    message: "Saved successfully"
                })
            } else {
                await marktables.deleteOne({id_student: username})
                await marks.save()
                res.status(200).json({
                    message: "Delete and save successfully"
                })
            }
        }else{
            res.status(400).json({
                statuscode: 400,
                message: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!"
            })
        }
    })
app.post('/api/save-ngoai-khoa', middleware.getLich, async function (req, res) {
    let token = req.body.token
    let check = await accounts.findOne({
        token: token
    })
    if (check !== null) {
        let username = check.code_student;
        let marksnk = new marknks({
            id_student: username,
            total: req.body.total,
            waiting: req.body.waiting,
            entries: req.body.entries
        });
        let check_nk = await marknks.findOne({
            id_student: username
        })
        if (check_nk == null) {
            await marksnk.save();
            res.status(200).json({
                message: "Saved successfully"
            })
        } else {
            await marknks.deleteOne({id_student: username})
            await marksnk.save();
            res.status(200).json({
                message: "Delete and save successfully"
            })
        }
    } else {
        res.status(401).json({
            statuscode: 401,
            message: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!"
        })
    }
})
app.post('/api/test', async function (req, res){
    var options = {
        'method': 'GET',
        'url': 'http://dkmh.tnut.edu.vn/Default.aspx?page=gioithieu',
        'headers': {
        }
      };
      request(options, function (error, response, html) {
          if(response){
              let $ = cheerio.load(html)
              let a = $('#__VIEWSTATE').attr('value')
              let options2 = {
                  'method': 'POST',
                  'url': 'http://dkmh.tnut.edu.vn/default.aspx?page=dangnhap',
                  'headers': {
                      "Host":'dkmh.tnut.edu.vn',
                      "Connection":'keep-alive',
                      "Upgrade-Insecure-Requests":'1',
                      "Origin":'http://dkmh.tnut.edu.vn',
                     "Content-Type":'multipart/form-data; boundary=----WebKitFormBoundaryltfmpHCvU9QNzQzY',
                     "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
                      "Accept":'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                      "Referer":'http://dkmh.tnut.edu.vn/default.aspx?page=dangnhap',
                     "Accept-Encoding":'',
                      "Accept-Language":'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
                  },
                  form: {
                      "__EVENTTARGET":'',
                      "__EVENTARGUMENT":'',
                      "__VIEWSTATE": a,
                      "__VIEWSTATEGENERATOR": 'CA0B0334',
                      "ctl00$ContentPlaceHolder1$ctl00$txtTaiKhoa":username,
                      "ctl00$ContentPlaceHolder1$ctl00$txtMatKhau":password,
                      "ctl00$ContentPlaceHolder1$ctl00$btnDangNhap":'Đăng Nhập'
                  }
              }
              request(options2, function(err,ress,html2){
                  if(ress){
                      let cookie = ress.headers['set-cookie']
                      cookie = cookie.toString()
                      let rs_cookie = cookie.replace("; path=/; HttpOnly", "")
                      setTimeout(function(){
                          let options3 = {
                              'method': 'GET',
                              'url': 'http://dkmh.tnut.edu.vn/default.aspx?page=gioithieu',
                              'headers': {
                                  "Host":'dkmh.tnut.edu.vn',
                                  "Connection":'keep-alive',
                                  "Upgrade-Insecure-Requests":'1',
                                 "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
                                  "Accept":'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                                  "Referer":'http://dkmh.tnut.edu.vn/default.aspx?page=dangnhap',
                                 "Accept-Encoding":'',
                                  "Accept-Language":'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
                                  "Cookie": rs_cookie
                              },
                          }
                          request(options3, function(errr, rss, html3){
                              if(rss){
                                  let options4 = {
                                      'method': 'GET',
                                      'url': 'http://dkmh.tnut.edu.vn/Default.aspx?page=xemdiemthi',
                                      'headers': {
                                          "Host":'dkmh.tnut.edu.vn',
                                          "Connection":'keep-alive',
                                          "Upgrade-Insecure-Requests":'1',
                                         "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
                                          "Accept":'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                                          "Referer":'http://dkmh.tnut.edu.vn/default.aspx?page=gioithieu',
                                         "Accept-Encodidng":'',
                                          "Accept-Lanadguage":'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
                                          "Cookie": rs_cookie
                                      },
                                  }
                                  request(options4, function(error, rsss, html4) {
                                      if(rsss){
                                          let $ = cheerio.load(html4)
                                          let b = $('#__VIEWSTATE').attr('value')
                                          let options5 = {
                                              'method': 'POST',
                                              'url': 'http://dkmh.tnut.edu.vn/Default.aspx?page=xemdiemthi',
                                              'headers': {
                                                  "Host":'dkmh.tnut.edu.vn',
                                                  "Connection":'keep-alive',
                                                  "Upgrade-Insecure-Requests":'1',
                                                  "Origin":'http://dkmh.tnut.edu.vn',
                                                 "Content-Type":'multipart/form-data; boundary=----WebKitFormBoundaryltfmpHCvU9QNzQzY',
                                                 "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
                                                  "Accept":'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                                                  "Referer":'http://dkmh.tnut.edu.vn/Default.aspx?page=xemdiemthi',
                                                 "Accept-Encoding":'',
                                                  "Accept-Language":'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
                                                  "Cookie": rs_cookie
                                              },
                                              form: {
                                                  "__EVENTTARGET":'ctl00$ContentPlaceHolder1$ctl00$lnkChangeview2',
                                                  "__EVENTARGUMENT":'',
                                                  "__VIEWSTATE": b,
                                                  "__VIEWSTATEGENERATOR": 'CA0B0334',
                                                  "ctl00$ContentPlaceHolder1$ctl00$txtChonHK":'',
                                              }
                                          }
                                          request(options5, function(errors, results, html5){
                                              let $ = cheerio.load(html5);
                                              let data = []
                                              let temp = []
                                              $("#ctl00_ContentPlaceHolder1_ctl00_div1 > table > tbody > .row-diem > td > span").each(function(i,e){
                                                  let rs = $(e).text()
                                                  temp.push(rs);
                                                  if((i + 1) % 13 == 0){
                                                      data.push(temp)
                                                      temp = [];
                                                  }
                                              })    
                                              let obj
                                              let result = []
                                              for(let i = 0; i< data.length; i++){
                                                  obj = {
                                                      "temon": data[i][2],
                                                      "mamon": data[i][1],
                                                      "sotc": data[i][3],
                                                      "chuyencan": data[i][6].trim(),
                                                      "thi": "L1: "+ data[i][7].trim() +" L2: "+ data[i][8],
                                                      "tkhp": data[i][10].trim(),
                                                      "diemchu": data[i][12],
                                                  }
                                                  result.push(obj)
                                              }
                                                let arr = []
                                                let tem = []
                                                $("#ctl00_ContentPlaceHolder1_ctl00_div1 > table > tbody > tr").each(function(index, element) {
                                                    let a = $(element).attr("class")
                                                    if(a == 'row-diemTK'){
                                                        $(element).find("td").find("span").each(function(i,e){
                                                            let rs = $(e).text()
                                                            if((i + 1) % 2 == 0){
                                                                tem.push(rs);
                                                            }
                                                        })
                                                    }
                                                    if(a == 'title-hk-diem'){
                                                        if(tem.length> 0){
                                                            arr.push(tem)
                                                            tem = []
                                                        }
                                                    }
                                                })
                                                if(tem.length> 0){
                                                    arr.push(tem)
                                                }
                                                let dtbc, dtbcqd, sotctuongduong, stctln
                                                for(let i = 0; i< arr.length; i++){
                                                    dtbc = arr[i][1].trim()
                                                    dtbcqd = arr[i][2].trim()
                                                    sotctuongduong = arr[i][4]
                                                    stctln = arr[i][4]
                                                }
                                                let rs_diem = {
                                                    "tongsotc": "",
                                                    "sotctuongduong": sotctuongduong,
                                                    "stctln": stctln,
                                                    "dtbc": dtbc,
                                                    "dtbcqd": dtbcqd,
                                                    "somonkhongdat": "",
                                                    "sotckhongdat": "",
                                                    "dtbxltn": "",
                                                    "dtbmontn": "",
                                                    entries: result
                                                }
                                              res.status(200).json({
                                                  data: rs_diem
                                              })
                                          });
                                      }
                                  })
                              }
                          })
                      }, 3000);
                  }
              });
          }else{
            res.status(400).json({
                message: "error"
            })
          }
      });
})
app.get('*', function (req, res) {
    res.status(404).json({
        message: "Trang không tồn tại, vui lòng thử lại"
    });
})
app.post('*', function (req, res) {
    res.status(404).json({
        message: "Trang không tồn tại, vui lòng thử lại"
    });
})

if (!module.parent) {
    app.listen(port, host, async () => {
        console.log("Project runing port: " + port)
    });
}
module.exports = app
const request = require('request');
const cheerio = require('cheerio');
const moment = require('moment');
function getLichHocCN(username){
    return new Promise(function(resolve, reject){
        var options = {
            'method': 'GET',
            'url': `http://dkmh.tnut.edu.vn/default.aspx?page=thoikhoabieu&sta=1&id=${username}`,
            'headers': {}
        };
        request(options, function (error, response, html) {
            if (error) {
                console.log(error);
            } else {
                let $ = cheerio.load(html)
                if($ !== null){
                    let viewstate = $("#__VIEWSTATE").attr("value")
                    let hocky = $("#ctl00_ContentPlaceHolder1_ctl00_ddlChonNHHK").find("option").attr("value")
                    let options2 = {
                        'method': 'POST',
                        'url':  `http://dkmh.tnut.edu.vn/default.aspx?page=thoikhoabieu&sta=1&id=${username}`,
                        'headers': {
                            'Host': 'dkmh.tnut.edu.vn',
                            'Connection': 'keep-alive',
                            'Cache-Control': 'max-age=0',
                            'Upgrade-Insecure-Requests': '1',
                            'Origin': 'http://dkmh.tnut.edu.vn',
                            'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary6YtOoJZmSx338VS7',
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36',
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                            'Referer': `http://dkmh.tnut.edu.vn/default.aspx?page=thoikhoabieu&sta=1&id=${username}`,
                            'Accept-Encoding': '',
                            'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7'
                        },
                        form: {
                            "__EVENTTARGET": 'ctl00$ContentPlaceHolder1$ctl00$rad_ThuTiet',
                            "__EVENTARGUMENT": '',
                            "__LASTFOCUS": '',
                            "__VIEWSTATE": viewstate,
                            "__VIEWSTATEGENERATOR": 'CA0B0334',
                            "ctl00$ContentPlaceHolder1$ctl00$ddlChonNHHK": hocky,
                            "ctl00$ContentPlaceHolder1$ctl00$ddlLoai": '1',
                            "ctl00$ContentPlaceHolder1$ctl00$rad_ThuTiet": 'rad_ThuTiet',
                            "ctl00$ContentPlaceHolder1$ctl00$rad_MonHoc": 'rad_MonHoc'
                        }
                    }
                    request(options2, function (err, ress, html2) {
                        if (err) {
                            console.log(err);
                        } else {
                            let cookie = ress.headers['set-cookie']
                            cookie = cookie.toString()
                            let rs_cookie = cookie.replace("; path=/; HttpOnly", "")
                            let options3 = {
                                'method': 'GET',
                                'url':  `http://dkmh.tnut.edu.vn/default.aspx?page=thoikhoabieu&sta=1&id=${username}`,
                                'headers': {
                                    'Host': 'dkmh.tnut.edu.vn',
                                    'Connection': 'keep-alive',
                                    'Cache-Control': 'max-age=0',
                                    'Upgrade-Insecure-Requests': '1',
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36',
                                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                                    'Referer':  `http://dkmh.tnut.edu.vn/default.aspx?page=thoikhoabieu&sta=1&id=${username}`,
                                    'Accept-Encoding': '',
                                    'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
                                    'Cookie': rs_cookie,
                                    'Content-Type': 'text/plain',
                                }
                            }
                            request(options3, function (er, rs, html3) {
                                if (er) {
                                    console.log(er);
                                } else {
        
                                    let obj, arr = [],
                                        temp = [],
                                        rs_lichhoc = [],
                                        rs, startTime1, endTime1
                                    let $ = cheerio.load(html3)
                                    let table = $("#ctl00_ContentPlaceHolder1_ctl00_pnlHeader > table > tbody > tr:nth-child(2) > td > div.grid-roll2 > table.body-table").each(function (i, e) {
                                        if (i > 0) {
                                            let td = $(e).find("tbody > tr > td").each(function (ind, ele) {
                                                rs = $(ele).text();
                                                if (ind == 13) {
                                                    let onmouseover = $(ele).find("div").attr("onmouseover")
                                                    var regex = /ddrivetiptuan\((.+?)\)/gm;
                                                    var match = regex.exec(onmouseover)[1];
                                                    startTime1 = match.substring(1, 11)
                                                    endTime1 = match.substring(13, 23)
                                                    rs = startTime1 + " " + endTime1
                                                }
                                                temp.push(rs);
                                                if ((ind + 1) % 15 == 0) {
                                                    arr.push(temp);
                                                    temp = []
                                                }
        
                                            })
                                        }
                                    })
                                    var TNUT_WDAY = {
                                        "CN": 0,
                                        "Hai": 1,
                                        "Ba": 2,
                                        "Tư": 3,
                                        "Năm": 4,
                                        "Sáu": 5,
                                        "Bảy": 6,
                                    };
                                    for (let i = 0; i < arr.length; i++) {
                                        let data = arr[i]
                                        let mamon = data[0]
                                        let hocphan = data[1];
                                        let day_thu = data[8];
                                        let tietbd = data[9];
                                        let sotiet = data[10];
                                        let diadiem = data[11];
                                        // let thoigian = "";
                                        obj = {
                                            loailich: "LichHoc",
                                            hocphan: hocphan,
                                            mamon: mamon,
                                            thoigian: "",
                                            tiethoc: tietbd,
                                            diadiem: diadiem ? diadiem : "",
                                            hinhthuc: "",
                                            giaovien: "",
                                            dot: "",
                                            sobaodanh: "",
                                            ghichu: "",
                                        }
                                        if (typeof sotiet !== "undefined" && parseInt(sotiet) > 1) {
                                            let arr_tiethoc = []
                                            let tiet = tietbd + "," + parseInt(parseInt(tietbd) + parseInt(sotiet) - 1)
                                            tiet = tiet.split(",")
                                            tiet[0] = parseInt(tiet[0])
                                            tiet[1] = parseInt(tiet[1])
                                            for(let j = tiet[0]; j <= tiet[1]; j++){
                                                arr_tiethoc.push(j)
                                            }
                                            obj.tiethoc = arr_tiethoc.toString()
                                            // obj.tiethoc = tietbd + "-" + parseInt(parseInt(tietbd) + parseInt(sotiet) - 1)
                                        }
                                        let thu = TNUT_WDAY[day_thu]
                                        let thoigian = data[13]
                                        thoigian = thoigian.split(" ")
                                        var startTime = moment(thoigian[0], "DD/MM/YYYY").toDate();
                                        var endTime = moment(thoigian[1], "DD/MM/YYYY").toDate();
                                        for (var pivot = startTime; pivot.getTime() <= endTime.getTime(); pivot.setDate(pivot.getDate() + 7)) {
                                            while (pivot.getDay() != thu) {
                                                pivot.setDate(pivot.getDate() + 1);
                                            }
                                            var date = new Date(pivot.setDate(pivot.getDate()));
                                            var year = date.getFullYear();
        
                                            var month = (1 + date.getMonth()).toString();
                                            month = month.length > 1 ? month : '0' + month;
        
                                            var day = date.getDate().toString();
                                            day = day.length > 1 ? day : '0' + day;
        
                                            var me = Object.assign({}, obj); // copy object
        
                                            me.thoigian = day + '/' + month + '/' + year;
        
                                            rs_lichhoc.push(me)
        
                                        }
        
                                    }
                                    resolve(rs_lichhoc)
                                }
                            })
                        }
                    })
                }else{
                    reject
                }
            }
        });
    })
}
function getLichThiCN(username){
    return new Promise(function (resolve, reject) {
        var options = {
            'method': 'GET',
            'url': `http://dkmh.tnut.edu.vn/Default.aspx?page=xemlichthi&id=${username}`,
            'headers': {
            }
        };
        request(options, async function (error, response, html) {
            if (response) {
                const $ = cheerio.load(html)
                let data = []
                let temp = []
                let a = $("#ctl00_ContentPlaceHolder1_ctl00_gvXem>tbody>tr>td").each(function (index, element) {
                    let rs = $(element).find("span")
                    let b = $(rs).text()
                    temp.push(b);
                    if ((index + 1) % 12 == 0) {
                        data.push(temp)
                        temp = [];
                    }
                })
                let obj;
                let result = []
                for (let i = 0; i < data.length; i++) {
                    let sotiet = data[i][8], tietbd = data[i][7]
                    obj = {
                        "loailich": "LichThi",
                        "hocphan": data[i][2],
                        "mamon": data[i][1],
                        "thoigian": data[i][6],
                        "diadiem": data[i][9],
                        "tiethoc": tietbd,
                        "ghichu": data[i][10]
                    }
                    if(typeof sotiet !== "undefined" && parseInt(sotiet) > 1){
                        let arr_tiethoc = []
                        let tiet = tietbd + "," + parseInt(parseInt(tietbd) + parseInt(sotiet) - 1)
                        tiet = tiet.split(",")
                        tiet[0] = parseInt(tiet[0])
                        tiet[1] = parseInt(tiet[1])
                        for(let j = tiet[0]; j <= tiet[1]; j++){
                            arr_tiethoc.push(j)
                        }
                        obj.tiethoc = arr_tiethoc.toString()
                        // obj.tiethoc = tietbd + "," + parseInt(parseInt(tietbd) + parseInt(sotiet) - 1)
                    }
                    result.push(obj)
                }
               resolve(result)
            }else{
                reject(error)
            }
        });
    })
}
function getProFileCN(username, password){
    return new Promise(function (resolve, reject){
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
                                          'url': 'http://dkmh.tnut.edu.vn/Default.aspx?page=xemlichthi',
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
                                              let data = []
                                              let $ =  cheerio.load(html4)
                                              let ttcn = $(".infor-member > .center > table > tbody")
                                              let dt = $(ttcn).find("tr").find("td").find("span")
                                              $(dt).each(function(i,e){
                                                  let b = $(e).text()
                                                  data.push(b)
                                              })
                                              let obj = {
                                                  "school": "TNUT",
                                                  "code_student": data[1],
                                                  "full_name": data[3],
                                                  "class": data[9],
                                                  "majors": data[11],
                                                  "hedaotao": data[15],
                                                  "course": data[17],
                                              }
                                              resolve(obj);
                                          }
                                      })
                                  }
                              })
                          }, 3000);
                        
                      }
                  });
              }else{
                  reject(error);
              }
          });
    })

}
function getDiemCN(username, password){
    return new Promise(function (resolve, reject){
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
                                                  resolve(rs_diem)
                                              });
                                          }
                                      })
                                  }
                              })
                          }, 3000);
                      }
                  });
              }else{
                reject(error)
              }
          });
    })
}

module.exports = {
    getLichHocCN,
    getLichThiCN,
    getProFileCN,
    getDiemCN
}
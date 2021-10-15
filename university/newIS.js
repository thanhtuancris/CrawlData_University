// const chilkat = require('@chilkat/ck-node12-win64');
const chilkat = require('@chilkat/ck-node12-linux64');
const cheerio = require('cheerio');
const fs = require('fs');
const reader = require('xlsx')
const moment = require('moment');
function getTimeTableQT(username, password) {
        return new Promise(function (resolve, reject) {
            var http_request = new chilkat.HttpRequest();
            var http = new chilkat.Http();
            let url = 'https://daotao2.tnu.edu.vn/kqt'
            var data = http.QuickRequest('GET', url)
            let $ = cheerio.load(data.BodyStr)
            if($ != null){
                let viewstate = $('#__VIEWSTATE').attr('value')
                let rs_url = data.FinalRedirectUrl
    
                http_request.AddHeader("Referer", rs_url);
                http_request.AddHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0");
                http.SaveCookies = true;
                http.SendCookies = true;
                http.CookieDir = "memory";
                http_request.AddParam("txtUserName", username);
                http_request.AddParam("txtPassword", password);
                http_request.AddParam("__EVENTTARGET", "");
                http_request.AddParam("__EVENTARGUMENT", "");
                http_request.AddParam("__LASTFOCUS", "");
                http_request.AddParam("__VIEWSTATE", viewstate);
                http_request.AddParam("__VIEWSTATEGENERATOR", "029E46E3");
                http_request.AddParam("PageHeader1$drpNgonNgu", "C9E94FA9DBE84A2F8A4688630562EF56");
                http_request.AddParam("PageHeader1$hidisNotify", "0");
                http_request.AddParam("btnSubmit", "Đăng+nhập");
                http_request.AddParam("hidUserId", "");
                http_request.AddParam("hidUserFullName", "");
                http_request.AddParam("hidTrainingSystemId", "");
    
    
    
                var login = http.PostUrlEncoded(rs_url + "?url=https://daotao2.tnu.edu.vn/kqt/Home.aspx", http_request);
                var lichhoc = http.QuickGetStr(rs_url.replace('login.aspx', 'Reports/Form/StudentTimeTable.aspx'))
                var $2 = cheerio.load(lichhoc)
                let dothoc = $2("#lblSemester").text()
                dothoc = dothoc.split(" ")
                let viewstate2 = $2('#__VIEWSTATE').attr('value')
                let hidStudentId = $2('#hidStudentId').attr('value')
                let hidAcademicYearId = $2('#hidAcademicYearId').attr('value')
                let hidFieldId = $2('#hidFieldId').attr('value')
                let hidAdminClassId = $2('#hidAdminClassId').attr('value')
                let hidTuanBatDauHK2 = $2('#hidTuanBatDauHK2').attr('value')
                let hidTrainingSystemId = $2('#hidTrainingSystemId').attr('value')
                let hidFieldLevel = $2('#hidFieldLevel').attr('value')
                let hidFacultyId = $2('#hidFacultyId').attr('value')
                let hidXetHeSoHocPhiDoiTuongTheoNganh = $2('#hidXetHeSoHocPhiDoiTuongTheoNganh').attr('value')
                let hidXetHeSoHocPhiTheoDoiTuong = $2("hidXetHeSoHocPhiTheoDoiTuong").attr('value')
                let drpSemester = $2("#drpSemester option:selected").attr('value');
                let hidTerm = $2("#hidTerm").attr('value')
                let hidShowTeacher = $2('#hidShowTeacher').attr('value')
                let hidUniversityCode = $2('#hidUniversityCode').attr('value')
                let drpTerm = $2("#drpTerm option:selected").attr('value');
                let PageHeader1$drpNgonNgu = $2("#PageHeader1_drpNgonNgu option:selected").attr('value');
                let hidTuitionFactorMode = $2('#hidTuitionFactorMode').attr('value')
                let hidLoaiUuTienHeSoHocPhi = $2('#hidLoaiUuTienHeSoHocPhi').attr('value')
    
                http_request.AddParam("__EVENTTARGET", "");
                http_request.AddParam("__EVENTARGUMENT", "");
                http_request.AddParam("__LASTFOCUS", "");
                http_request.AddParam("__VIEWSTATE", viewstate2);
                http_request.AddParam("PageHeader1$drpNgonNgu", PageHeader1$drpNgonNgu);
                http_request.AddParam("PageHeader1$hidisNotify", "0");
                http_request.AddParam("PageHeader1$hidValueNotify", "");
                http_request.AddParam("drpSemester", drpSemester);
                http_request.AddParam("drpTerm", drpTerm);
                http_request.AddParam("hidDiscountFactor: ", "");
                http_request.AddParam("hidReduceTuitionType: ", "");
                http_request.AddParam("hidXetHeSoHocPhiTheoDoiTuong", hidXetHeSoHocPhiTheoDoiTuong);
                http_request.AddParam("hidTuitionFactorMode", hidTuitionFactorMode);
                http_request.AddParam("hidLoaiUuTienHeSoHocPhi", hidLoaiUuTienHeSoHocPhi);
                http_request.AddParam("hidSecondFieldId", "");
                http_request.AddParam("hidSecondAyId", "2");
                http_request.AddParam("hidSecondFacultyId", "");
                http_request.AddParam("hidSecondAdminClassId", "");
                http_request.AddParam("hidSecondFieldLevel", "");
                http_request.AddParam("hidXetHeSoHocPhiDoiTuongTheoNganh", hidXetHeSoHocPhiDoiTuongTheoNganh);
                http_request.AddParam("hidUnitPriceDetail", "1");
                http_request.AddParam("hidFacultyId", hidFacultyId);
                http_request.AddParam("hidFieldLevel", hidFieldLevel);
                http_request.AddParam("hidPrintLocationByCode", "0");
                http_request.AddParam("hidUnitPriceKP", "");
                http_request.AddParam("drpType", "C");
                http_request.AddParam("btnView", "Xuất file Excel");
                http_request.AddParam("hidStudentId", hidStudentId);
                http_request.AddParam("hidAcademicYearId", hidAcademicYearId);
                http_request.AddParam("hidFieldId", hidFieldId);
                http_request.AddParam("hidTerm", hidTerm);
                http_request.AddParam("hidShowTeacher", hidShowTeacher);
                http_request.AddParam("hidUnitPrice", "");
                http_request.AddParam("hidTuitionCalculating", "0");
                http_request.AddParam("hidTrainingSystemId", hidTrainingSystemId);
                http_request.AddParam("hidAdminClassId", hidAdminClassId);
                http_request.AddParam("hidTuitionStudentType", "1");
                http_request.AddParam("hidStudentTypeId", "");
                http_request.AddParam("hidUntuitionStudentTypeId", "");
                http_request.AddParam("hidUniversityCode", hidUniversityCode);
                http_request.AddParam("hidTuanBatDauHK2", hidTuanBatDauHK2);
                http_request.AddParam("hidSoTietSang", "6");
                http_request.AddParam("hidSoTietChieu", "6");
                http_request.AddParam("hidSoTietToi", "3");
                let xuat_excel = http.PostUrlEncoded(rs_url.replace('login.aspx', 'Reports/Form/StudentTimeTable.aspx'), http_request)
                let path = 'input.xls';
                let arr_data = [],
                    day_thu
                var IS_WDAY = {
                    "CN": 0,
                    "2": 1,
                    "3": 2,
                    "4": 3,
                    "5": 4,
                    "6": 5,
                    "7": 6,
                };
                fs.open(path, 'w', function (err, fd) {
                    if (err) {
                        throw 'could not open file: ' + err;
                    }
                    fs.write(fd, xuat_excel.Body, 0, xuat_excel.Body.length, null, function (err) {
                        if (err) throw 'error writing file: ' + err;
                        fs.close(fd, function () {
                            // console.log('wrote the file successfully');
                            const file = reader.readFile(path)
                            fs.unlinkSync(path)
                            const sheets = file.SheetNames
                            for (let i = 0; i < sheets.length; i++) {
                                const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]])
                                temp.forEach((res) => {
                                    arr_data.push(res)
                                })
                            }
                            let arr_lichhoc2 = []
                            for (let j = 0; j < arr_data.length; j++) {
                                if (j > 3 && j < arr_data.length - 5 && arr_data[j].__EMPTY_9 !== '') {
                                    var obj = {
                                        loailich: "LichHoc",
                                        hocphan: arr_data[j].__EMPTY_1 ? arr_data[j].__EMPTY_1 : '',
                                        mamon: arr_data[j].__EMPTY ? arr_data[j].__EMPTY : '',
                                        thoigian: "",
                                        tiethoc: arr_data[j].__EMPTY_6,
                                        diadiem: "",
                                        hinhthuc: "",
                                        giaovien: "",
                                        dot: dothoc[dothoc.length - 1] ? dothoc[dothoc.length - 1] : '',
                                        ghichu: "",
                                    }
                                    if (arr_data[j].__EMPTY_2 !== '') {
                                        day_thu = "2";
                                        let rs = arr_data[j].__EMPTY_2
                                        rs = rs.split("\n")
                                        switch (rs.length) {
                                            case 6:
                                                obj.tiethoc = rs[0] + " & " + rs[2] + " & " + rs[4]
                                                obj.diadiem = rs[1].replace(/\(|\)/gm, '') + " & " + rs[3].replace(/\(|\)/gm, '') + " & " + rs[5].replace(/\(|\)/gm, '')
                                                break;
                                            case 4:
                                                obj.tiethoc = rs[0] + " & " + rs[2]
                                                obj.diadiem = rs[1].replace(/\(|\)/gm, '') + " & " + rs[3].replace(/\(|\)/gm, '')
                                                break;
                                            default:
                                                obj.tiethoc = rs[0]
                                                obj.diadiem = rs[1].replace(/\(|\)/gm, '')
                                        }
                                    }
                                    if (arr_data[j].__EMPTY_3 !== '') {
                                        day_thu = "3";
                                        let rs = arr_data[j].__EMPTY_3
                                        rs = rs.split("\n")
                                        switch (rs.length) {
                                            case 6:
                                                obj.tiethoc = rs[0] + " & " + rs[2] + " & " + rs[4]
                                                obj.diadiem = rs[1].replace(/\(|\)/gm, '') + " & " + rs[3].replace(/\(|\)/gm, '') + " & " + rs[5].replace(/\(|\)/gm, '')
                                                break;
                                            case 4:
                                                obj.tiethoc = rs[0] + " & " + rs[2]
                                                obj.diadiem = rs[1].replace(/\(|\)/gm, '') + " & " + rs[3].replace(/\(|\)/gm, '')
                                                break;
                                            default:
                                                obj.tiethoc = rs[0]
                                                obj.diadiem = rs[1].replace(/\(|\)/gm, '')
                                        }
                                    }
                                    if (arr_data[j].__EMPTY_4 !== '') {
                                        day_thu = "4";
                                        let rs = arr_data[j].__EMPTY_4
                                        rs = rs.split("\n")
                                        switch (rs.length) {
                                            case 6:
                                                obj.tiethoc = rs[0] + " & " + rs[2] + " & " + rs[4]
                                                obj.diadiem = rs[1].replace(/\(|\)/gm, '') + " & " + rs[3].replace(/\(|\)/gm, '') + " & " + rs[5].replace(/\(|\)/gm, '')
                                                break;
                                            case 4:
                                                obj.tiethoc = rs[0] + " & " + rs[2]
                                                obj.diadiem = rs[1].replace(/\(|\)/gm, '') + " & " + rs[3].replace(/\(|\)/gm, '')
                                                break;
                                            default:
                                                obj.tiethoc = rs[0]
                                                obj.diadiem = rs[1].replace(/\(|\)/gm, '')
                                        }
                                    }
                                    if (arr_data[j].__EMPTY_5 !== '') {
                                        day_thu = "5";
                                        let rs = arr_data[j].__EMPTY_5
                                        rs = rs.split("\n")
                                        switch (rs.length) {
                                            case 6:
                                                obj.tiethoc = rs[0] + " & " + rs[2] + " & " + rs[4]
                                                obj.diadiem = rs[1].replace(/\(|\)/gm, '') + " & " + rs[3].replace(/\(|\)/gm, '') + " & " + rs[5].replace(/\(|\)/gm, '')
                                                break;
                                            case 4:
                                                obj.tiethoc = rs[0] + " & " + rs[2]
                                                obj.diadiem = rs[1].replace(/\(|\)/gm, '') + " & " + rs[3].replace(/\(|\)/gm, '')
                                                break;
                                            default:
                                                obj.tiethoc = rs[0]
                                                obj.diadiem = rs[1].replace(/\(|\)/gm, '')
                                        }
                                    }
                                    if (arr_data[j].__EMPTY_6 !== '') {
                                        day_thu = "6";
                                        let rs = arr_data[j].__EMPTY_6
                                        rs = rs.split("\n")
                                        switch (rs.length) {
                                            case 6:
                                                obj.tiethoc = rs[0] + " & " + rs[2] + " & " + rs[4]
                                                obj.diadiem = rs[1].replace(/\(|\)/gm, '') + " & " + rs[3].replace(/\(|\)/gm, '') + " & " + rs[5].replace(/\(|\)/gm, '')
                                                break;
                                            case 4:
                                                obj.tiethoc = rs[0] + " & " + rs[2]
                                                obj.diadiem = rs[1].replace(/\(|\)/gm, '') + " & " + rs[3].replace(/\(|\)/gm, '')
                                                break;
                                            default:
                                                obj.tiethoc = rs[0]
                                                obj.diadiem = rs[1].replace(/\(|\)/gm, '')
                                        }
                                    }
                                    if (arr_data[j].__EMPTY_7 !== '') {
                                        day_thu = "7";
                                        let rs = arr_data[j].__EMPTY_7
                                        rs = rs.split("\n")
                                        switch (rs.length) {
                                            case 6:
                                                obj.tiethoc = rs[0] + " & " + rs[2] + " & " + rs[4]
                                                obj.diadiem = rs[1].replace(/\(|\)/gm, '') + " & " + rs[3].replace(/\(|\)/gm, '') + " & " + rs[5].replace(/\(|\)/gm, '')
                                                break;
                                            case 4:
                                                obj.tiethoc = rs[0] + " & " + rs[2]
                                                obj.diadiem = rs[1].replace(/\(|\)/gm, '') + " & " + rs[3].replace(/\(|\)/gm, '')
                                                break;
                                            default:
                                                obj.tiethoc = rs[0]
                                                obj.diadiem = rs[1].replace(/\(|\)/gm, '')
                                        }
                                    }
                                    if (arr_data[j].__EMPTY_8 !== '') {
                                        day_thu = "CN";
                                        let rs = arr_data[j].__EMPTY_8
                                        rs = rs.split("\n")
                                        switch (rs.length) {
                                            case 6:
                                                obj.tiethoc = rs[0] + " & " + rs[2] + " & " + rs[4]
                                                obj.diadiem = rs[1].replace(/\(|\)/gm, '') + " & " + rs[3].replace(/\(|\)/gm, '') + " & " + rs[5].replace(/\(|\)/gm, '')
                                                break;
                                            case 4:
                                                obj.tiethoc = rs[0] + " & " + rs[2]
                                                obj.diadiem = rs[1].replace(/\(|\)/gm, '') + " & " + rs[3].replace(/\(|\)/gm, '')
                                                break;
                                            default:
                                                obj.tiethoc = rs[0]
                                                obj.diadiem = rs[1].replace(/\(|\)/gm, '')
                                        }
                                    }
                                    let thu = IS_WDAY[day_thu]
                                    let thoigian = arr_data[j].__EMPTY_9
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
                                        if(me.tiethoc.includes('&') || me.diadiem.includes('&')){
                                            let tiethoc= me.tiethoc.split('&');
                                            let diadiem= me.diadiem.split('&');
                                            for(let j = 0; j < tiethoc.length; j++){
                                                let arr_tiethoc2 = []
                                                var me2 = Object.assign({}, me);
                                                let tiet = tiethoc[j].trim().split("-")
                                                tiet[0] = parseInt(tiet[0])
                                                tiet[1] = parseInt(tiet[1])
                                                for(let k = tiet[0]; k <= tiet[1]; k++){
                                                    arr_tiethoc2.push(k)
                                                }
                                                me2.tiethoc = arr_tiethoc2.toString();
                                                me2.diadiem = diadiem[j].trim();
                                                arr_lichhoc2.push(me2)
                                            }
            
                                        }else{
                                            let arr_tiethoc = []
                                            let tiethoc = me.tiethoc.split('-');
                                            tiethoc[0] = parseInt(tiethoc[0])
                                            tiethoc[1] = parseInt(tiethoc[1])
                                            for(let j = tiethoc[0]; j <= tiethoc[1]; j++){
                                                arr_tiethoc.push(j)
                                            }
                                            me.tiethoc = arr_tiethoc.toString()
                                            arr_lichhoc2.push(me)
                                        }
                                        
                                    }
    
                                }
    
                            }
                            resolve(arr_lichhoc2)
                        });
                    })
                })
            }else{
                reject
            }
        
        })
} 
function getProfileQT(username, password){
    return new Promise(function(resolve, reject){
        var http_request = new chilkat.HttpRequest();
        var http = new chilkat.Http();
        let url = 'https://daotao2.tnu.edu.vn/kqt'
        var data = http.QuickRequest('GET', url)
        let $ = cheerio.load(data.BodyStr)
        if($ != null) {
            let viewstate = $('#__VIEWSTATE').attr('value')
            let rs_url = data.FinalRedirectUrl

            http_request.AddHeader("Referer", rs_url);
            http_request.AddHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0");
            http.SaveCookies = true;
            http.SendCookies = true;
            http.CookieDir = "memory";
            http_request.AddParam("txtUserName", username);
            http_request.AddParam("txtPassword", password);
            http_request.AddParam("__EVENTTARGET", "");
            http_request.AddParam("__EVENTARGUMENT", "");
            http_request.AddParam("__LASTFOCUS", "");
            http_request.AddParam("__VIEWSTATE", viewstate);
            http_request.AddParam("__VIEWSTATEGENERATOR", "029E46E3");
            http_request.AddParam("PageHeader1$drpNgonNgu", "C9E94FA9DBE84A2F8A4688630562EF56");
            http_request.AddParam("PageHeader1$hidisNotify", "0");
            http_request.AddParam("btnSubmit", "Đăng+nhập");
            http_request.AddParam("hidUserId", "");
            http_request.AddParam("hidUserFullName", "");
            http_request.AddParam("hidTrainingSystemId", "");
            var login = http.PostUrlEncoded(rs_url + "?url=https://daotao2.tnu.edu.vn/kqt/Home.aspx", http_request);
            var profile = http.QuickGetStr(rs_url.replace('login.aspx', 'StudentMark.aspx'))
            var $2 = cheerio.load(profile)
        
            let msv = $2("div.row:nth-child(1) > div:nth-child(2)").text();
            let hoten = $2("#lblStudentName").text()
            let course = $2("#lblAy").text()
            let majors = $2("#drpField > option:nth-child(1)").text()
            let lop = $2("#lblAdminClass").text()
            let IU_profile = {
                school: "IU",
                id_student: "",
                code_student: msv,
                avatar: "https://static-s.aa-cdn.net/img/gp/20600010958995/VmiZFrG4kmnqcuaBCeDXzPIEqyC1RGW-W6WywMvO-KOnuCdqaYyw5Q4JJspTBV8wP7M=s300?v=1",
                full_name: hoten,
                class: lop,
                majors: majors,
                course: course,
                hdt: "",
            }
            resolve(IU_profile)
        }else{
            reject
        }
    })
}
function getMarkTableQT(username, password){
    return new Promise(function (resolve, reject) {
        var http_request = new chilkat.HttpRequest();
        var http = new chilkat.Http();
        let url = 'https://daotao2.tnu.edu.vn/kqt'
        var data = http.QuickRequest('GET', url)
        let $ = cheerio.load(data.BodyStr)
        if($ !== null){
            let viewstate = $('#__VIEWSTATE').attr('value')
            let __VIEWSTATEGENERATOR = $('#__VIEWSTATEGENERATOR').attr('value')
            let rs_url = data.FinalRedirectUrl

            http_request.AddHeader("Referer", rs_url);
            http_request.AddHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0");
            http.SaveCookies = true;
            http.SendCookies = true;
            http.CookieDir = "memory";
            http_request.AddParam("txtUserName", username);
            http_request.AddParam("txtPassword", password);
            http_request.AddParam("__EVENTTARGET", "");
            http_request.AddParam("__EVENTARGUMENT", "");
            http_request.AddParam("__LASTFOCUS", "");
            http_request.AddParam("__VIEWSTATE", viewstate);
            http_request.AddParam("__VIEWSTATEGENERATOR", __VIEWSTATEGENERATOR);
            http_request.AddParam("PageHeader1$drpNgonNgu", "C9E94FA9DBE84A2F8A4688630562EF56");
            http_request.AddParam("PageHeader1$hidisNotify", "0");
            http_request.AddParam("btnSubmit", "Đăng+nhập");
            http_request.AddParam("hidUserId", "");
            http_request.AddParam("hidUserFullName", "");
            http_request.AddParam("hidTrainingSystemId", "");



            var login = http.PostUrlEncoded(rs_url + "?url=https://daotao2.tnu.edu.vn/kqt/Home.aspx", http_request);
            var diem = http.QuickGetStr(rs_url.replace('login.aspx', 'StudentMark.aspx'))
            let $2 = cheerio.load(diem)
            
            let rs_arr = []
            let table_length = $2("#tblStudentMark > tbody:nth-child(1) > tr").length
            let table = $2("#tblStudentMark > tbody:nth-child(1) > tr").each(function (i, e) {
                if (i > 0 && i < table_length - 1) {
                    let arr = []
                    let td = $(e).find("td").each(function (index, ele) {
                        let rs_td = $(ele).text()
                        arr.push(rs_td)
                    })
                    rs_arr.push(arr)
                }
            })
            let obj, rs_diem = []

            for (let i = 0; i < rs_arr.length; i++) {
                obj = {
                    mamon: rs_arr[i][1],
                    temon: rs_arr[i][2],
                    sotc: rs_arr[i][3],
                    chuyencan: rs_arr[i][13],
                    thi: rs_arr[i][14],
                    tkhp: rs_arr[i][15],
                    diemchu: rs_arr[i][16],
                }
                rs_diem.push(obj)
            }
            let dtbc = $2("tr.cssListAlternativeItem:nth-child(5) > td:nth-child(3)").text()
            let dtbcqd = $2("tr.cssListAlternativeItem:nth-child(5) > td:nth-child(5)").text()
            let stctln = $2("tr.cssListAlternativeItem:nth-child(5) > td:nth-child(7)").text()
            let marktable = {
                "tongsotc": "",
                "sotctuongduong": "",
                "stctln": stctln,
                "dtbc": dtbc,
                "dtbcqd": dtbcqd,
                "somonkhongdat": "",
                "sotckhongdat": "",
                "dtbxltn": "",
                "dtbmontn": "",
                entries: rs_diem
            }
            resolve(marktable)
        }else{
            reject
        }
    })
}

module.exports = {
    getTimeTableQT, 
    getProfileQT,
    getMarkTableQT
}
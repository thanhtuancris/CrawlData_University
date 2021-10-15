module.exports = {
    getLich: function(req,res,next){
        if(!req.body.token){
            res.status(400).json({
                message: "Token không được để trống"
            })
            return
        }
        if(!req.body.key || req.body.key !== '"123bnka^&*(*jlsdbnipa892%&nln@#$%vb123&^5asadas:"!%"'){
            res.status(400).json({
                message: "Mời nhập lại key"
            })
            return
        }
        if(!req.headers.thangdeptrai || req.headers.thangdeptrai !== 'ThangDepTRaiVCL'){
            res.status(400).json({
                message: "Mời nhập lại thangdeptrai"
            })
            return
        }
        if(!req.headers.hieudbak || req.headers.hieudbak !== 'dungnobede'){
            res.status(400).json({
                message: "Mời nhập lại hieudbak"
            })
            return
        }
        if(!req.headers.tuyenoc || req.headers.tuyenoc !== 'nooccutvcl'){
            res.status(400).json({
                message: "Mời nhập lại tuyenoc"
            })
            return
        }
        if(!req.headers.tuancr || req.headers.tuancr !== 'nhuconcac'){
            res.status(400).json({
                message: "Mời nhập lại tuancr"
            })
            return
        }
        next()
    }
}
const express = require('express');
const db = require('../../../db/models');
const crService = require('./crService');
const crSearch = require('./crSearch');
const {globalResponseSet, resbuilder} = require('../../common/resbuilder');
const authenticate = require('../../middleware/authenticate');
const {wrapAsync} = require('../../common/errorhandler');
const router = express.Router() 

//router.post('/searchMusinsa',wrapAsync(authenticate), wrapAsync(crSearch.searchMusinsa)); //무신사 서치 라우터

router.post('/clothes',wrapAsync(authenticate),async (req, res, next) => {  //모든 옷 정보주기
  try {
    const clothes = await db.Clothes.findAll({
      
        where: { styler_id: req.user.styler_id },
      
    });
    console.log(clothes);
    res.send(resbuilder(globalResponseSet.API_SUCCESS, clothes));
    
  } catch (err) {
    console.error(err);
    next(err);
  }
});


router.post('/nearReserve',wrapAsync(authenticate),async (req, res, next) => {  
  result = await crService.nearReserve(req.user.id);
  res.send(resbuilder(globalResponseSet.API_SUCCESS, result));
}); //가까운 미래의 일정을 하나 알려줌


router.post('/checkReserve',wrapAsync(authenticate), async (req, res, next) => { //해당 월에 이 옷을 얼마나 예약했는지
  result = await crService.checkReservation(req.body.cloth_id,req.body.year,req.body.month);
  res.send(resbuilder(globalResponseSet.API_SUCCESS, result));
  
 });

 router.post('/checkUserReserve',wrapAsync(authenticate), async (req, res, next) => { //해당 유저의 옷 예약 기록(특정달)
  result = await crService.checkUserReservation(req.user.id,req.body.year,req.body.month);
  res.send(resbuilder(globalResponseSet.API_SUCCESS, result));
  
 });

router.post('/checkDuplicate',wrapAsync(authenticate),async(req,res,next)=>{ // 삭제해도됨 테스트 용이라
  So=await crService.checkDuplicate(req.body.cloth_id,req.body.year,req.body.month,req.body.date);
  res.send(So);
});

router.post('/addCreserve',wrapAsync(authenticate),async (req, res, next) => { //옷 일정 추가요청
  if (await crService.checkDuplicate(req.body.cloth_id,req.body.year,req.body.month,req.body.date)){
    res.send(resbuilder(globalResponseSet.CREATE_CRESERVE_OVERLAP)); //true면 옷 추가 못함
    return;
  }
  else{
  //var mergedDate= new Date(Number(req.body.year),Number(req.body.month)-1,Number(req.body.date)+1,0,0,0);
  var utc = new Date(Date.UTC(Number(req.body.year),Number(req.body.month)-1,Number(req.body.date),0,0,0));
  //console.log(utc);
  await crService.createCreserve(req.user,req.body.description,utc,req.body.cloth_id); //해당 유저의 데이터 추가 요청
  res.send(resbuilder(globalResponseSet.API_SUCCESS));
  }
  
});

router.post('/addCloth',wrapAsync(authenticate),async (req, res, next)=>{
  created_cloth=await crService.createCloth(req.user.styler_id,req.body.clothName,req.body.brand,req.body.type,req.body.Utype,req.body.URL);
  res.send(resbuilder(globalResponseSet.API_SUCCESS,created_cloth));
});

  
module.exports = router;
const express = require('express');
const router = express.Router();
const path = require('path');
const request = require('request');


router.get('/', (req, res) => {
	var calls = 0;
	var verdictList = [], contestList = [];
	function callback(){
		calls++;
		if(calls == 1){
			res.render('home', {
				username: req.cookies.user,
				problemVerdicts: verdictList,
				problemscount: contestList,
			});
		}
	}
	request('https://codeforces.com/api/user.status?handle=wrong_answer', { json: true }, (err, res, body) => {
		if (err) { return console.log(err); }
		var ok = 0, ce = 0, re = 0, wa = 0, tle = 0, me = 0;
		var submissions = body.result;
		for(var i = 0; i < submissions.length; i++){
			if(submissions[i].verdict == 'OK'){
				ok++;
			}
			if(submissions[i].verdict == 'COMPILATION_ERROR'){
				ce++;
			}
			if(submissions[i].verdict == 'RUNTIME_ERROR'){
				re++;
			}
			if(submissions[i].verdict == 'WRONG_ANSWER'){
				wa++;
			}
			if(submissions[i].verdict == 'TIME_LIMIT_EXCEEDED'){
				tle++;
			}
			if(submissions[i].verdict == 'MEMORY_LIMIT_EXCEEDED'){
				me++;
			}
		}
		verdictList = [ok, ce, re, wa, tle, me];


		contestList=[0,0,0,0,0,0,0,0,0];
		var mymap = new Map();
		for(var i = 0; i < submissions.length; i++)
		{
			if(submissions[i].author.participantType == "CONTESTANT" && submissions[i].verdict == "OK")
			{
				var contest_id=submissions[i].contestId;
				if(mymap.has(contest_id))
				{
					var a=mymap.get(contest_id);
					mymap.set(contest_id,a+1);
				}
				else 
					mymap.set(contest_id,1);
			}
		}
		for(const [key,value] of mymap.entries())
		{
			contestList[value]+=1;
		}
		callback();
		
	});
});

	

module.exports = router;
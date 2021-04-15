var app = angular.module('myApp',['ngRoute']);

app.config(function($routeProvider){
    $routeProvider
    .when('/', {
        templateUrl: 'home.html'
    })
    .when('/subjects', {
        templateUrl: 'subjects.html',
        controller: 'subjectsCtrl'
    })
    .when('/quiz/:id/:name', {
        templateUrl: 'quiz-app.html',
       controller: 'quizsCtrl'
    })
    
});

//dic file quiz cau hoi tung mon
app.controller('quizsCtrl', function($scope, $http, $routeParams, quizFactory){
    
    $http.get('../db/Quizs/'+$routeParams.id+'.js').then(function(res){
       quizFactory.questions = res.data;
   })
});
//doc file subz ten quiz
app.controller('subjectsCtrl', function($scope, $http){
    $scope.list_subject = [];
    $http.get('../db/Subjects.js').then(function(res){
        $scope.list_subject = res.data;
    })
});

app.directive('quizfpoly', function(quizFactory, $routeParams){
    return{
        restrict : 'AE',
        scope :{},
        templateUrl:'template-quiz.html',
        link: function(scope, elem, attrs){
            scope.start = function(){
                quizFactory.getQuestions().then(function(){
                    //ten moon
                    scope.subjectName = $routeParams.name; 
                    scope.id = 1;
                    scope.quizOver= false; 
                    scope.inProgess = true;
                    scope.getQuestion();
                });
               
               };
            scope.reset =function(){
                scope.inProgess = false;
                scope.score = 0 ;
            };
            //goi 
            scope.getQuestion = function(){
                var quiz = quizFactory.getQuestion(scope.id);
                if(quiz){
                 scope.question = quiz.Text;
                scope.options = quiz.Answers;
                scope.answer = quiz.AnswerId;
                //thong bao cau hoi dung sai
                scope.answerMode = true;
                }else{
                    scope.quizOver = true;
                }
                
               
            }
            //kieemr tra 
            scope.checkAnswer = function(){
               // alert('answer');
               if(!$('input[name = answer]:checked').length) return;
                   var ans = $('input[name = answer]:checked').val();
               if(ans == scope.answer){
               // alert('dung');
               scope.score++;  
               scope.scorrectAns = true;
               }else{
               // alert('sai');
                scope.scorrectAns = false;
               }
                 //thong bao cau hoi dung sai
               scope.answerMode = false;
            };
            //nexx
            scope.nextQuestion = function(){
                scope.id++;
                scope.getQuestion();
            }
            scope.reset();
        }
    }
});
//addfile
app.factory('quizFactory', function($http, $routeParams){
    
    //10cauhoi
    //goi file fac 2 lan copy xuong ques ,retue lai kq
    return{
        getQuestions: function(){
           return $http.get('../db/Quizs/'+ $routeParams.id +'.js').then(function (res){

                questions = res.data;
               // alert(questions.length);
            });
        },
        getQuestion:function(id){
            var randomItem = questions[Math.floor(Math.random()* questions.length)];
            var count = questions.length;
            if(count>10){
                count = 10;
            }
            
            if(id< count){
                return randomItem;

            }else{
                return false;
            }
           
        }
    }
});

//$routeParams doc ten
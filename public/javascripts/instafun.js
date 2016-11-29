angular.module('comment', [])
    .controller('MainCtrl', [
        '$scope', '$http',
        function($scope, $http) {

            $scope.comments = [];
            $scope.photoUrl = '';
            $scope.imgNum = -1;

            $scope.getPhoto = function() {
                return $http.get('/photo').success( function(data) {
                    $scope.photoUrl = data.photoUrl;
                    $scope.imgNum = data.imgNum;
                    $scope.getComments();
                });
            };

            $scope.getNextPhoto = function() {
                $scope.imgNum++;
                return $http.get('/next?imgNum=' + $scope.imgNum)
                    .success( function(data) {
                    $scope.photoUrl = data.photoUrl;
                    $scope.imgNum = data.imgNum;
                    $scope.getComments();
                });
            };

            $scope.getPreviousPhoto = function() {
                $scope.imgNum--;
                return $http.get('/next?imgNum=' + $scope.imgNum)
                    .success( function(data) {
                        $scope.photoUrl = data.photoUrl;
                        $scope.imgNum = data.imgNum;
                        $scope.getComments();
                    });
            };

            $scope.getComments = function() {
                return $http.get('/comments?imgNum=' + $scope.imgNum)
                    .success( function(data) {
                    angular.copy(data, $scope.comments);
                });
            };

            $scope.create = function(comment) {
                return $http.post('/comment', comment).success( function(data) {
                    $scope.comments.push(data);
                });
            };

            $scope.upVote = function(comment) {
                return $http.put('/comments/' + comment._id + '/upvote')
                    .success( function(data) {
                        console.log("upvote worked");
                        comment.upvotes++;
                    });
            };

            $scope.addComment = function() {
                if($scope.name === '' || $scope.comment === '') { return; }
                $scope.create({
                    name: $scope.name,
                    comment: $scope.comment,
                    upvotes: 0,
                    imgNum: $scope.imgNum
                });
                $scope.name = '';
                $scope.comment = '';
            };

            $scope.voteUp = function(comment) {
                $scope.upVote(comment);
            };
        }
    ]);
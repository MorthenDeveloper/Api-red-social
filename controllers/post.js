'use strict'

var path=require('path');
var fs=require('fs');
var moment=require('moment');
var mongoosePaginate=require('mongoosePaginate');
var mongoose=require('mongoose');

var Post=require('../models/post');
var User=require('../models/user');
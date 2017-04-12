create database heliactin;

use heliactin;

/*
 * 用户表
 */
CREATE TABLE IF NOT EXISTS users (
    id int NOT NULL AUTO_INCREMENT,	              /* 用户 ID（唯一标识） */
    username varchar(32) NOT NULL,				        /* 用户名 */
    nickname varchar(32) NOT NULL,                /* 用户昵称 */
    password varchar(256) NOT NULL,			          /* 密码 */
    salt varchar(128) NOT NULL,				            /* 密码加密盐 */
    gender int DEFAULT '0',			                  /* 性别  1:male , 2:female , 3: other */
    avatar varchar(256) DEFAULT NULL,		          /* 头像路径 */
    autograph varchar(128) DEFAULT NULL,			    /* 签名 */
  	PRIMARY KEY (id)
);

/*
 * 好友列表
 */
CREATE TABLE IF NOT EXISTS friends (
    id int NOT NULL AUTO_INCREMENT,	              /* 好友列表 ID（唯一标识） */
    user_id int NOT NULL,		          		        /* 用户 ID */
    friends_id int NOT NULL,			                /* 用户好友 ID */
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (friends_id) REFERENCES users(id),
  	PRIMARY KEY (id)
);

/*
 * 用户组表
 */
CREATE TABLE IF NOT EXISTS groups (
    id int NOT NULL AUTO_INCREMENT,	              /* 组 ID（唯一标识） */
    groupname varchar(32) DEFAULT NULL,				    /* 组名 */
    gavatar varchar(256) DEFAULT NULL,		        /* 组头像路径 */
    gautograph varchar(128) DEFAULT NULL,			    /* 组签名 */
    owner_id int NOT NULL,                       /* 创建人 ID */
    FOREIGN KEY (ownner_id) REFERENCES users(id),
  	PRIMARY KEY (id)
);

/*
 * 组成员表
 */
CREATE TABLE IF NOT EXISTS group_members (
    id int NOT NULL AUTO_INCREMENT,	              /* 组成员表 ID（唯一标识） */
    group_id int NOT NULL,		                    /* 组 ID */
    group_member_id int NOT NULL,			            /* 组签名 */
    FOREIGN KEY (group_id) REFERENCES groups(id),
    FOREIGN KEY (group_member_id) REFERENCES users(id),
  	PRIMARY KEY (id)
);
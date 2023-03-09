<template>
  <div class="dou-yin-comments">

<!--    document.getElementsByClassName('comment-mainContent')[0].scrollTop =10000000-->

<!--    <el-table class="dou-yin-comment-table" style="width: 80%"-->
<!--              :data="commentList" border>-->
<!--      <el-table-column prop="image" label="头像">-->
<!--        <template slot-scope="scope">-->
<!--          <img style="width: 40px;height: 40px;border-radius: 40px" :src="image"/>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column prop="name" label="用户名"></el-table-column>-->
<!--      <el-table-column prop="comment" label="评论内容"></el-table-column>-->
<!--      <el-table-column prop="time" label="时间"></el-table-column>-->
<!--      <el-table-column prop="address" label="地点"></el-table-column>-->
<!--      <el-table-column prop="likeNumber" label="点赞数"></el-table-column>-->
<!--      <el-table-column prop="authorLike" label="作者赞过">-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.authorLike ? '赞过' : '无' }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->

<!--      <el-table-column fixed="right" label="操作">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>-->
<!--          <el-button type="text" size="small">编辑</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--    </el-table>-->
  </div>
</template>

<script>
export default {
  name: 'Comments',
  data () {
    return {
      image: 'https://p3-pc.douyinpic.com/img/aweme-avatar/tos-cn-i-0813_145eec1c940a479d96a295860f8bcc37~c5_300x300.jpeg?from=2956013662',
      commentList: [
        {
          name: '孙先森',
          image: this.image,
          comment: '这真的是团结...谁也没想出风头，能进，谁进都一样[赞]',
          time: '19小时前',
          address: '北京',
          likeNumber: 12,
          authorLike: false
        },
        {
          name: '孙先森',
          image: this.image,
          comment: '这真的是团结...谁也没想出风头，能进，谁进都一样[赞]',
          time: '19小时前',
          address: '北京',
          likeNumber: 12,
          authorLike: false
        },
        {
          name: '孙先森',
          image: this.image,
          comment: '这真的是团结...谁也没想出风头，能进，谁进都一样[赞]',
          time: '19小时前',
          address: '北京',
          likeNumber: 12,
          authorLike: false
        },
        {
          name: '孙先森',
          image: this.image,
          comment: '这真的是团结...谁也没想出风头，能进，谁进都一样[赞]',
          time: '19小时前',
          address: '北京',
          likeNumber: 12,
          authorLike: false
        },
        {
          name: '孙先森',
          image: this.image,
          comment: '这真的是团结...谁也没想出风头，能进，谁进都一样[赞]',
          time: '19小时前',
          address: '北京',
          likeNumber: 12,
          authorLike: false
        },
        {
          name: '孙先森',
          image: this.image,
          comment: '这真的是团结...谁也没想出风头，能进，谁进都一样[赞]',
          time: '19小时前',
          address: '北京',
          likeNumber: 12,
          authorLike: false
        },
        {
          name: '孙先森',
          image: this.image,
          comment: '这真的是团结...谁也没想出风头，能进，谁进都一样[赞]',
          time: '19小时前',
          address: '北京',
          likeNumber: 12,
          authorLike: false
        },
        {
          name: '孙先森',
          image: this.image,
          comment: '这真的是团结...谁也没想出风头，能进，谁进都一样[赞]',
          time: '19小时前',
          address: '北京',
          likeNumber: 12,
          authorLike: false
        },
        {
          name: '孙先森',
          image: this.image,
          comment: '这真的是团结...谁也没想出风头，能进，谁进都一样[赞]',
          time: '19小时前',
          address: '北京',
          likeNumber: 12,
          authorLike: false
        },
        {
          name: '孙先森',
          image: this.image,
          comment: '这真的是团结...谁也没想出风头，能进，谁进都一样[赞]',
          time: '19小时前',
          address: '北京',
          likeNumber: 12,
          authorLike: false
        },
        {
          name: '孙先森',
          image: this.image,
          comment: '这真的是团结...谁也没想出风头，能进，谁进都一样[赞]',
          time: '19小时前',
          address: '北京',
          likeNumber: 12,
          authorLike: false
        },
        {
          name: '孙先森',
          image: this.image,
          comment: '这真的是团结...谁也没想出风头，能进，谁进都一样[赞]',
          time: '19小时前',
          address: '北京',
          likeNumber: 12,
          authorLike: false
        },
        {
          name: '孙先森',
          image: this.image,
          comment: '这真的是团结...谁也没想出风头，能进，谁进都一样[赞]',
          time: '19小时前',
          address: '北京',
          likeNumber: 12,
          authorLike: false
        },
        {
          name: '孙先森',
          image: this.image,
          comment: '这真的是团结...谁也没想出风头，能进，谁进都一样[赞]',
          time: '19小时前',
          address: '北京',
          likeNumber: 12,
          authorLike: false
        },
        {
          name: '孙先森',
          image: this.image,
          comment: '这真的是团结...谁也没想出风头，能进，谁进都一样[赞]',
          time: '19小时前',
          address: '北京',
          likeNumber: 12,
          authorLike: false
        },
        {
          name: '孙先森',
          image: this.image,
          comment: '这真的是团结...谁也没想出风头，能进，谁进都一样[赞]',
          time: '19小时前',
          address: '北京',
          likeNumber: 12,
          authorLike: false
        },
        {
          name: '孙先森',
          image: this.image,
          comment: '这真的是团结...谁也没想出风头，能进，谁进都一样[赞]',
          time: '19小时前',
          address: '北京',
          likeNumber: 12,
          authorLike: false
        },
        {
          name: '孙先森',
          image: this.image,
          comment: '这真的是团结...谁也没想出风头，能进，谁进都一样[赞]',
          time: '19小时前',
          address: '北京',
          likeNumber: 12,
          authorLike: false
        },
        {
          name: '孙先森',
          image: this.image,
          comment: '这真的是团结...谁也没想出风头，能进，谁进都一样[赞]',
          time: '19小时前',
          address: '北京',
          likeNumber: 12,
          authorLike: false
        },
        {
          name: '孙先森',
          image: this.image,
          comment: '这真的是团结...谁也没想出风头，能进，谁进都一样[赞]',
          time: '19小时前',
          address: '北京',
          likeNumber: 12,
          authorLike: false
        },
        {
          name: '孙先森',
          image: this.image,
          comment: '这真的是团结...谁也没想出风头，能进，谁进都一样[赞]',
          time: '19小时前',
          address: '北京',
          likeNumber: 12,
          authorLike: false
        },
        {
          name: '孙先森',
          image: this.image,
          comment: '这真的是团结...谁也没想出风头，能进，谁进都一样[赞]',
          time: '19小时前',
          address: '北京',
          likeNumber: 12,
          authorLike: false
        },
        {
          name: '孙先森',
          image: this.image,
          comment: '这真的是团结...谁也没想出风头，能进，谁进都一样[赞]',
          time: '19小时前',
          address: '北京',
          likeNumber: 12,
          authorLike: false
        },
        {
          name: '孙先森',
          image: this.image,
          comment: '这真的是团结...谁也没想出风头，能进，谁进都一样[赞]',
          time: '19小时前',
          address: '北京',
          likeNumber: 12,
          authorLike: false
        }
      ]
    };
  }
};
</script>

<style lang="less" scoped>
.dou-yin-comments {
  width: 100%;
  display: flex;
  justify-content: center;

  .dou-yin-comment-table {
  }
}
</style>

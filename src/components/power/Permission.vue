<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>权限列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图区 -->
		<el-card>
			<el-table :data="permisssionList" border stripe>
				<el-table-column type="index" width="50"></el-table-column>
				<el-table-column label="权限名称" prop="name"></el-table-column>
				<el-table-column label="权限URL" prop="uri"></el-table-column>SS
				<!-- <el-table-column label="邮箱" prop="email"></el-table-column>
				<el-table-column label="状态" prop="status">
					<template slot-scope="scope">
						<el-switch :active-value="1" :inactive-value="0" v-model="scope.row.status" @change="changeStatus(scope.row)">
						</el-switch>
					</template>
				</el-table-column> -->
				<el-table-column label="操作" width="250px">
					<template slot-scope="scope">
						<!-- 修改 -->
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
						<!-- 删除 -->
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteOpen(scope.row.id)"></el-button>
						<!-- 分配角色 -->
						<el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
							<el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
			<!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNum"
			 :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination> -->
		</el-card>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				baseUrl: "/tigerPermission",
				queryInfo: {
					pageSize: 5,
					pageNum: 1
				},
				permisssionList:[]
			}
		},
		created(){
			this.getPermisssion();
		},
		methods:{
			getPermisssion(){
				debugger
				this.$http.get(`${this.baseUrl}/page`,this.$qs.stringify(this.queryInfo))
				.then(respon=>{
						this.permisssionList = respon.data.data.records;
				})
			}
		}
	}
</script>

<style>
</style>

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
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNum"
			 :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-card>
		
		<!-- 修改权限Dialog标签 -->
		<el-dialog title="修改权限" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
			<!-- 内容主题区 -->
			<el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
				<el-form-item label="权限名称" prop="name">
					<!-- prop验证规则参数 -->
					<el-input v-model="editForm.name" disabled></el-input>
				</el-form-item>
				<el-form-item label="权限URL" prop="uri">
					<!-- prop验证规则参数 -->
					<el-input v-model="editForm.uri"></el-input>
				</el-form-item>
				<el-form-item label="权限CODE" prop="code">
					<el-input v-model="editForm.code"></el-input>
				</el-form-item>
			</el-form>
			<!-- 底部区 -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editPermisssion">确 定</el-button>
			</span>
		</el-dialog>
		
		
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
				permisssionList:[],
				total:0,
				editDialogVisible:false,
				addForm:{},
				editForm:{},
				editFormRules:{}
			}
		},
		created(){
			this.getPageList();
		},
		methods:{
			getPageList(){
				debugger
				this.$http.get(`${this.baseUrl}/page`,{params:this.queryInfo})
				.then(respon=>{
						this.permisssionList = respon.data.data.records;
						this.total = respon.data.data.total;
				})
			},
			handleSizeChange(newsize) {
				/* 切换一页条数 */
				console.log(newsize)
				this.queryInfo.pageSize = newsize;
				this.getPageList();
			},
			handleCurrentChange(newpage) {
				/* 切换到第几页 */
				console.log(newpage)
				this.queryInfo.pageNum = newpage;
				this.getPageList();
			},
			showEditDialog(id){
				this.$http.get(`${this.baseUrl}/findById/${id}`).then(respon => {
					if (respon.data.status == "888888") {
						this.editForm = respon.data.data
					} else {
						return this.$message.error(`${respon.data.msg}`)
					}
				})
				this.editDialogVisible = true;
			},
			deleteOpen(id) {
				debugger
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$http.delete(`${this.baseUrl}/deleteById/${id}`).then(resopn=>{
						if(resopn.data.status=="888888"){
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
							this.getPageList();
						}else{
							this.$message({
								type: 'error',
								message: `${resopn.data.msg}`
							});
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			editDialogClosed(){
				this.$refs.editFormRef.resetFields();
			},
			editPermisssion(){
				
			}
		}
	}
</script>

<style>
</style>

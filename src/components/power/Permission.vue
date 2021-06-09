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
			<el-col :span="4" style="margin-bottom: 10px;">
				<el-button type="primary" @click="showAddDialog">添加</el-button>
			</el-col>
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
					<el-input v-model="editForm.name" ></el-input>
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
		
		<!-- 添加权限Dialog标签 -->
		<el-dialog title="添加权限" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed">
			<!-- :before-close="handleClose" -->
			<!-- 内容主题区 -->
			<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
				<el-form-item label="父权限" prop="name" style="min-height: 30px;">
					<el-tree :data="treeList" :props="treeProps" :highlight-current="true" 
					 node-key="id"   ref="treeRef" @node-click="nodeClick">
					</el-tree>
				</el-form-item>
				<el-form-item label="权限名称" prop="name">
					<!-- prop验证规则参数 -->
					<el-input v-model="addForm.name" ></el-input>
				</el-form-item>
				<el-form-item label="权限URL" prop="uri">
					<!-- prop验证规则参数 -->
					<el-input v-model="addForm.uri"></el-input>
				</el-form-item>
				<el-form-item label="权限CODE" prop="code">
					<el-input v-model="addForm.code"></el-input>
				</el-form-item>
			</el-form>
			<!-- 底部区 -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addPermission">确 定</el-button>
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
				addDialogVisible:false,
				addForm:{},
				editForm:{},
				editFormRules:{},
				addFormRules:{},
				treeList:[],
				treeProps:{
					children: 'children',
					label: 'name'
				},
				currentKey:""
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
				
			},
			addPermission(){
				const currentNodeKey =   this.$refs.treeRef.getCurrentKey();
				this.addForm.pid = currentNodeKey;
				
				this.$http.post(`${this.baseUrl}/save`,this.$qs.stringify(this.addForm))
				.then(respon=>{
					if(respon.data.status=='888888'){
						this.$message.success("添加权限成功")
						this.getPageList()
					}else{
						this.$message.error(respon.data.msg)
					}
				})
				this.addDialogVisible = false;
			},
			showAddDialog(){
				this.$http.get(`/tigerRole/getAllPermissionTree`)
				.then(respon=>{
					if(respon.data.status!='888888'){
						this.$message.error("获取权限树形数据失败！");
					}else{
						this.treeList = respon.data.data;
						//this.getDefaultKeys(role,this.defaultPerKeys);
						this.$message.success("获取权限树形数据成功！");
					}
				})
				this.addDialogVisible = true;
				
			},
			addDialogClosed(){
				
			},
			nodeClick(data){
				
				// if(this.currentKey){
				//   const  newCurrentkey = this.$refs.treeRef.getCurrentKey();
				// }
				// this.currentKey =  this.$refs.treeRef.getCurrentKey();
				// if(currentKey){
				// 	this.$refs.treeRef.setCurrentKey(null)
				// }else{
					
				// }
				
			}
		}
	}
</script>

<style lang="less" >
.el-tree{
	max-height: 200px;
    overflow-y: auto;
    background-color: #f5edf0;
}
.el-tree-node:focus > .el-tree-node__content {
  background-color: #ccc !important;
} 
</style>

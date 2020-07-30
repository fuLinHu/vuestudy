<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图区 -->
		<el-card>
			<el-row :gutter="20">
				<el-col :span="7">
					<el-input clearable placeholder="请输入内容" v-model="queryInfo.username" class="input-with-select" @clear="getPageList">
						<el-button slot="append" icon="el-icon-search" @click="getPageList"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="addDialogVisible = true">添加</el-button>
				</el-col>
			</el-row>
			<el-table :data="userList" border stripe>
				<el-table-column type="index" width="50"></el-table-column>
				<el-table-column label="姓名" prop="username"></el-table-column>
				<el-table-column label="昵称" prop="nickname"></el-table-column>SS
				<el-table-column label="邮箱" prop="email"></el-table-column>
				<el-table-column label="状态" prop="status">
					<template slot-scope="scope">
						<!-- {{scope.row}} 显示一列所有数据 -->
						<el-switch :active-value="1" :inactive-value="0" v-model="scope.row.status" @change="changeStatus(scope.row)">
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="250px">
					<template slot-scope="scope">
						<!-- 修改 -->
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
						<!-- 删除 -->
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteOpen(scope.row.id)"></el-button>
						<!-- 分配角色 -->
						<el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
							<el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetting(scope.row)"></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNum"
			 :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-card>


		<!-- 添加用户Dialog标签 -->
		<el-dialog title="添加用户" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed">
			<!-- :before-close="handleClose" -->
			<!-- 内容主题区 -->
			<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
				<el-form-item label="用户名" prop="username">
					<!-- prop验证规则参数 -->
					<el-input v-model="addForm.username"></el-input>
				</el-form-item>
				<el-form-item label="昵称" prop="nickname">
					<!-- prop验证规则参数 -->
					<el-input v-model="addForm.nickname"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<!-- prop验证规则参数 -->
					<el-input v-model="addForm.password"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<!-- prop验证规则参数 -->
					<el-input v-model="addForm.email"></el-input>
				</el-form-item>
			</el-form>
			<!-- 底部区 -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addUser">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 修改用户Dialog标签 -->
		<el-dialog title="修改用户" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
			<!-- :before-close="handleClose" -->
			<!-- 内容主题区 -->
			<el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
				<el-form-item label="用户名" prop="username">
					<!-- prop验证规则参数 -->
					<el-input v-model="editForm.username" disabled></el-input>
				</el-form-item>
				<el-form-item label="昵称" prop="nickname">
					<!-- prop验证规则参数 -->
					<el-input v-model="editForm.nickname"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<!-- prop验证规则参数 -->
					<el-input v-model="editForm.password"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<!-- prop验证规则参数 -->
					<el-input v-model="editForm.email"></el-input>
				</el-form-item>
			</el-form>
			<!-- 底部区 -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editUser">确 定</el-button>
			</span>
		</el-dialog>
		
		<!-- setting分配角色 -->
		<el-dialog title="分配角色" :visible.sync="settingDialogVisible" width="30%" @close="settingDialogClosed">
			<div>
				<p>当前用户名:{{userInfo.username}}</p>
				<p>用户昵称:{{userInfo.nickname}}</p>
				<p>分配角色:
					 <el-select v-model="selectRolesData" placeholder="请选择">
					    <el-option
					      v-for="item in roleList"
					      :key="item.id"
					      :label="item.roleName"
					      :value="item.id">
					    </el-option>
					  </el-select>
				</p>
			</div>
			<!-- 底部区 -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="settingDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="allocateRole">确 定</el-button>
			</span>
		</el-dialog>

	</div>


</template>

<script>
	export default {
		data() {
			var checkEmail = (rule, value, callback) => {
				const checkEmail =
					/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				if (checkEmail.test(value)) {
					return callback();
				}
				callback(new Error('邮箱格式错误'));
			}
			return {
				baseUrl: "/tigerUser",
				queryInfo: {
					username: "",
					pageSize: 5,
					pageNum: 1
				},
				userList: [],
				roleList:[],
				total: 0,
				/* 控制add对话框展示隐藏 */
				addDialogVisible: false,
				/* 控制edit对话框展示隐藏 */
				editDialogVisible: false,
				settingDialogVisible:false,
				// 添加用户表单数据
				addForm: {
					username: "",
					nickname: "",
					password: "",
					email: ""
				},
				editForm: {

				},
				//添加表单验证规则对象
				addFormRules: {
					username: [{
							required: true,
							message: '请输入用户名称',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 10,
							message: '用户名称长度是3-10之间',
							trigger: 'blur'
						}
					],
					nickname: [{
							required: true,
							message: '请输入用户昵称',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 10,
							message: '用户昵称长度是3-10之间',
							trigger: 'blur'
						}
					],
					password: [{
							required: true,
							message: '请输入用户密码',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 10,
							message: '用户昵称长度是3-10之间',
							trigger: 'blur'
						}
					],
					email: [{
							required: true,
							message: '请输入邮箱',
							trigger: 'blur'
						},
						{
							validator: checkEmail,
							trigger: 'blur'
						}
					]
				},
				editFormRules: {
					nickname: [{
							required: true,
							message: '请输入用户昵称',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 10,
							message: '用户昵称长度是3-10之间',
							trigger: 'blur'
						}
					],
					password: [{
							required: true,
							message: '请输入用户密码',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 10,
							message: '用户昵称长度是3-10之间',
							trigger: 'blur'
						}
					],
					email: [{
							required: true,
							message: '请输入邮箱',
							trigger: 'blur'
						},
						{
							validator: checkEmail,
							trigger: 'blur'
						}
					]
				},
				userInfo:{},
				selectRolesData:[]

			}
		},
		created() {
			this.getPageList();
		},
		methods: {
			getPageList() {
				//this.$http.post("/user/findPage",{param:this.queryInfo})
				this.$http.post(`${this.baseUrl}/page`, this.$qs.stringify(this.queryInfo)).then(respon => {
					this.userList = respon.data.data.records;
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
			changeStatus(row) {

				console.log(row)
				this.$http.put(`/tigerUser/edit/${row.id}/${row.status}`)
					.then(respon => {
						debugger
						const status = respon.data.status;
						if (status == "888888") {
							this.$message.success("成功！")
						} else {
							this.$message.error("失败!")
							row.status = row.status == "1" ? "0" : "1";
						}
						console.log(respon)
					})
			},
			addDialogClosed() {
				this.$refs.addFormRef.resetFields();
			},
			addUser() {
				this.$refs.addFormRef.validate(valid => {
					if (!valid) {
						return;
					}
					this.$http.post(`${this.baseUrl}/save`, this.$qs.stringify(this.addForm)).then(respon => {
						if (respon.data.status != '888888') {
							this.$message.error("添加失败！");
						} else {
							this.$message.success("添加成功！");
							this.getPageList();
						}
						this.addDialogVisible = false;
					})
				})
			},
			showEditDialog(id) {
				this.$http.get(`${this.baseUrl}/findById/${id}`).then(respon => {
					if (respon.data.status == "888888") {
						this.editForm = respon.data.data
					} else {
						return this.$message.error(`查询用户：${id}失败。`)
					}
				})
				this.editDialogVisible = true;
			},
			editDialogClosed() {
				this.$refs.editFormRef.resetFields();
			},
			editUser() {
				this.$refs.editFormRef.validate(valid => {
					if (!valid) {
						return;
					} else {
						console.log(this.$qs.stringify(this.editForm))
						this.$http.put(`${this.baseUrl}/edit`, this.$qs.stringify({
								nickname: this.editForm.nickname,
								email: this.editForm.email,
								id: this.editForm.id
							}))
							.then(response => {
								if (response.data.status == '888888') {
									this.$message.success("修改用户成功")
								} else {
									this.$message.error("修改用户失败")
								}
								this.editDialogVisible = false;
								this.getPageList();
							})
					}
				})
			},
			deleteOpen(id) {
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
								message: '删除失败!'
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
			settingDialogClosed(){
				
			},
			//点击确定按钮分配角色
			allocateRole(){
				this.$http.put(`${this.baseUrl}/allocateRole`,this.$qs.stringify({
					id:this.userInfo.id,
					roleId:this.selectRolesData
				})).then(respon=>{
					if(respon.data.status=="888888"){''
						this.$message.success('分配角色成功')
					}else{
						this.$message.error(respon.data.msg)
					}
				})
				this.settingDialogVisible = false;
			},
			showSetting(param){
				debugger
				this.userInfo=param;
				this.$http.get(`${this.baseUrl}/roles`)
				.then(respon=>{
					if(respon.data.status=="888888"){
						this.roleList = respon.data.data;
					}else{
						this.$message.error(respon.data.msg)
					}
				})
				console.log(param)
				// this.roleId = param.id;
				// this.$http.get(`${this.baseUrl}/getAllPermissionTree`)
				// .then(respon=>{
				// 	if(respon.data.status!='888888'){
				// 		this.$message.error("获取权限树形数据失败！");
				// 	}else{
				// 		this.treeList = respon.data.data;
				// 		this.getDefaultKeys(param,this.defaultPerKeys);
				// 		this.$message.success("获取权限树形数据成功！");
				// 	}
				// })
				this.settingDialogVisible = true;
			}
		}
	}
</script>

<style>
	.el-table {
		margin-top: 15px;
		font-size: 12px;
	}

	.el-pagination {
		margin-top: 15px;
	}
</style>

<template>
	<div> 
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>角色管理</el-breadcrumb-item>
			<el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图区 -->
		<!-- 卡片视图区 -->
		<el-card>
			<el-row :gutter="20">
				<!-- <el-col :span="7">
					<el-input clearable placeholder="请输入内容" v-model="queryInfo.username" class="input-with-select" @clear="getUserList">
						<el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
					</el-input>
				</el-col> -->
				<el-col :span="4">
					<el-button type="primary" @click="addDialogVisible = true">添加</el-button>
				</el-col>
			</el-row>
			<el-table :data="roleList" border stripe>
				<!-- 展开列 -->
				<el-table-column type="expand" width="50">
					<template slot-scope="scope">
						<el-row :class="['bdbottom',index===0?'bdtop':'','vcenter']" v-for="(v,index) in scope.row.children" :key="v.id"><!-- 一共分为24个栅栏 -->
							<!-- 一级菜单使用 -->
							<el-col :span="5">
								<el-tag closable @close="closePeriById(scope.row,v.id)">
									{{v.name}}	
									<i class="el-icon-caret-right"></i>
								</el-tag>
							</el-col>
							<!-- 二级和三级菜单使用 -->
							<el-col :span="19">
								<el-row :class="[index1===0?'':'bdtop','vcenter']" v-for="(v1,index1) in v.children" :key="v1.id">
									<!-- 二级权限 -->
									<el-col :span="6">
										<el-tag type="success" closable @close="closePeriById(scope.row,v1.id)">
											{{v1.name}}
											<i class="el-icon-caret-right"></i>
										</el-tag>
									</el-col>
									<!-- 三级权限 -->
									<el-col :span="18">
										<el-tag type="warning" v-for="(v2,index2) in v1.children" :key="v2.id" closable @close="closePeriById(scope.row,v2.id)">
											{{v2.name}}
										</el-tag>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</template>
				</el-table-column>
				<el-table-column type="index" width="50"></el-table-column>
				<el-table-column label="角色名称" prop="roleName"></el-table-column>
				<el-table-column label="角色描述" prop="roleDescription"></el-table-column>
				<el-table-column label="操作" width="250px">
					<template slot-scope="scope">
						<!-- 修改 -->
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
						<!-- 删除 -->
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteOpen(scope.row.id)"></el-button>
						<!-- 分配权限 -->
						<el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false" >
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
		<el-dialog title="添加角色" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed">
			<!-- :before-close="handleClose" -->
			<!-- 内容主题区 -->
			<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" >
				<el-form-item label="角色名称" prop="roleName">
					<!-- prop验证规则参数 -->
					<el-input v-model="addForm.roleName"></el-input>
				</el-form-item>
				<el-form-item label="角色描述" prop="roleDescription">
					<!-- prop验证规则参数 -->
					<el-input v-model="addForm.roleDescription"></el-input>
				</el-form-item>
			</el-form>
			<!-- 底部区 -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addRole">确 定</el-button>
			</span>
		</el-dialog>
		
		<!-- 修改用户Dialog标签 -->
		<el-dialog title="修改角色" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
			<!-- 内容主题区 -->
			<el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
				<el-form-item label="角色名称" prop="roleName">
					<!-- prop验证规则参数 -->
					<el-input v-model="editForm.roleName" disabled></el-input>
				</el-form-item>
				<el-form-item label="角色描述" prop="roleDescription">
					<!-- prop验证规则参数 -->
					<el-input v-model="editForm.roleDescription"></el-input>
				</el-form-item>
			</el-form>
			<!-- 底部区 -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editRole">确 定</el-button>
			</span>
		</el-dialog>
		<!-- setting权限 -->
		<el-dialog title="分配权限" :visible.sync="settingDialogVisible" width="30%" @close="settingDialogClosed">
			<!-- :before-close="handleClose" -->
			<!-- 内容主题区 -->
			<!-- 树形控件 -->
			<el-tree :data="treeList" :props="treeProps" :default-checked-keys="defaultPerKeys" 
			show-checkbox node-key="id" default-expand-all  ref="treeRef">
				
			</el-tree>  <!-- node-key="id"代表是树形中的唯一标识，不能重复 -->
			<!-- 底部区 -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="settingDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="allocatePermission">确 定</el-button>
			</span>
		</el-dialog>
		
	</div>
</template>

<script>
	export default{
		data(){
			return {
				baseUrl:"/tigerRole",
				queryInfo: {
					pageSize: 5,
					pageNum: 1
				},
				roleId:"",
				roleList:[],
				total: 0,
				addDialogVisible:false,
				editDialogVisible:false,
				settingDialogVisible:false,
				addForm:{},
				editForm:{},
				rules:{
					roleName: [{
							required: true,
							message: '请输入角色名称',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 10,
							message: '角色名称长度是2-10之间',
							trigger: 'blur'
						}
					],
					roleDescription: [{
							required: true,
							message: '请输入角色描述',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 20,
							message: '角色描述称长度是2-20之间',
							trigger: 'blur'
						}
					]
				},
				addFormRules:{},
				editFormRules:{},
				treeProps:{
					children: 'children',
					label: 'name'
				},
				// 树形信息数据
				treeList:[],
				//树形默认选中的key
				defaultPerKeys:[]
			}
		},
		mounted() {
			// 中的某个属性引用另外一个属性
			this.addFormRules = this.rules;
			this.editFormRules = this.rules;
		},
		created(){
			this.getPageList();
		},
		methods:{
			addRole(){
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
			addDialogClosed() {
				this.$refs.addFormRef.resetFields();
			},
			editDialogClosed(){
				this.$refs.editFormRef.resetFields();
			},
			settingDialogClosed(){
				this.defaultPerKeys=[]
			},
			editRole(){
				this.$refs.editFormRef.validate(valid => {
					if (!valid) {
						return;
					} else {
						console.log(this.$qs.stringify(this.editForm))
						this.$http.put(`${this.baseUrl}/edit`, this.$qs.stringify({
								roleName: this.editForm.roleName,
								roleDescription: this.editForm.roleDescription,
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
			closePeriById(role,permissionId){
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$http.delete(`${this.baseUrl}/deletePermissionByRole/${role.id}/${permissionId}/`).then(resopn=>{
						if(resopn.data.status=="888888"){
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
							role.children = resopn.data.data;
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
			showSetting(role){
				this.roleId = role.id;
				this.$http.get(`${this.baseUrl}/getAllPermissionTree`)
				.then(respon=>{
					if(respon.data.status!='888888'){
						this.$message.error("获取权限树形数据失败！");
					}else{
						this.treeList = respon.data.data;
						this.getDefaultKeys(role,this.defaultPerKeys);
						this.$message.success("获取权限树形数据成功！");
					}
				})
				this.settingDialogVisible = true;
			},
			getPageList() {
				//this.$http.post("/user/findPage",{param:this.queryInfo})
				this.$http.post(`${this.baseUrl}/page`, this.$qs.stringify(this.queryInfo)).then(respon => {
					this.roleList = respon.data.data.records;
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
			getDefaultKeys(node,arr){
				if(!node.children||node.children.length<=0){
					arr.push(node.id)
				}else{
					node.children.forEach(o=>{
						this.getDefaultKeys(o,arr);
					})
				}
				
			},
			allocatePermission(){
				const checkKeys=[
					...this.$refs.treeRef.getCheckedKeys(),
					...this.$refs.treeRef.getHalfCheckedKeys()
				]
				this.$http.post(`${this.baseUrl}/allocatePermission/${this.roleId}`,this.$qs.stringify({
					permissionIds:`${checkKeys.join(',')}`
				})).then(respon=>{
					if(respon.data.status!='888888'){
						this.$message.error(`${respon.data.msg}`);
					}else{
						this.$message.success("分配权限成功")
					}
				})
				this.settingDialogVisible = false;
				this.defaultPerKeys=[]
				
			}
		}
	}
</script>

<style lang="less" scoped>
	.el-tag{
		margin-top: 7px;
	}
	.bdbottom{
		border-bottom: 1px solid #d3d3d3;
	}
	.bdtop{
		border-top: 1px solid #d3d3d3;
	}
	.vcenter{
		display: flex;
		align-items: center;
	}
</style>

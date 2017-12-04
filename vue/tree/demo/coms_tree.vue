<template>
	<div class="tree-box">
		<ul v-for="td in treeData">
			<tree-node :model="td"></tree-node>
		</ul>
	</div>
</template>
<script>
import TreeNode from './tree_node'

	export default{
		name: 'tree',
		components:{
			TreeNode
		},
		data (){
			return {
				treeData: [{
				    label: 'Container 0',
				    key: 'c0',
				    content:[{
				        label: 'Section 0',
				        key: 's0',
				        content:[{
				            label: 'Element 0',
				            key: 'e0'
				        }]
				    }]
				},{
				    label: 'Container 1',
				    key: 'c1',
				    content:[{
				        label: 'Section 1',
				        key: 's1',
				        content:[{
				            label: 'Element 1',
				            key: 'e1'
				        }]
				    },{
				        label: 'Section 2',
				        key: 's2',
				        content:[{
				            label: 'Element 2',
				            key: 'e2'
				        }]
				    }]
				},{
				    label: 'Container 2',
				    key: 'c2',
				    content:[{
				        label: 'Section 3',
				        key: 's3',
				        content:[{
				            label: 'Element 3',
				            key: 'e3'
				        }]
				    }]
				},{
				    label: 'Container 3',
				    key: 'c3',
				    content:[{
				        label: 'Section 4',
				        key: 's4',
				        content:[]
				    }]
				}]
			}
		},
		created (){
			this.isTree = true;
		}
	}
</script>
<style lang="scss">
	ul{
		list-style: none;

		li{
			line-height: 1.5;
		}
	}
</style>
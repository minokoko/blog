<template>
	<li>
		<div class="tree-text" :class="{active: active}">
			<span v-if="isFolder" @click="toggle" class="tree-text__cntrl"> {{ open?'-':'+' }} </span>
		    <span @click="nodeClick(model)">{{ model.label }}</span>
		</div>
	    <ul v-for="td in model.content" v-if="model.content.length > 0" v-show="open">
	        <tree-node :model="td"></tree-node>
	    </ul>
	</li>
</template>
<script>
	export default{
		name: 'treeNode',
		props:['model'],
		data () {
			return {
				open: false,
				active: false
			}
		},
		computed:{
			isFolder (){
				return (this.model.content && this.model.content.length > 0);
			}
		},
		methods:{
			toggle (){
				if(this.isFolder){
					this.open = !this.open;
				}
			},
			nodeClick (model){
				this.active = !this.active;
				if(this.active){
					this.tree.$emit('nodeSelectedClick', model);
				}
			}
		},
		created(){
			const parent = this.$parent;
			if(parent.isTree){
				this.tree = parent;
			}else{
				this.tree = parent.tree;
			}
		}
	}
</script>
<style lang="scss">
	.tree-text{
		.tree-text__cntrl{
			display: inline-block;
			width: 20px;
			text-align: center;
			cursor: pointer;
		}

		&:hover{
			background-color: #f4f4f4;
			cursor: pointer;
		}

		&.active{
			background-color: #e4e4e4;
		}
	}
</style>
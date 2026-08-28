extends Node

var model_cache: Dictionary = {}

const MODEL_PATHS := {
	"tree": "res://assets/models/environment/tree.glb",
	"bench": "res://assets/models/props/bench.glb",
	"player": "res://assets/models/characters/player.glb",
	"flag": "res://assets/models/props/flag.glb",
}

const FALLBACK_SCENES := {
	"tree": "res://scenes/fallbacks/TreePlaceholder.tscn",
}

func get_model(key: String) -> PackedScene:
	if model_cache.has(key):
		return model_cache[key]
	var path = MODEL_PATHS.get(key, "")
	if path.is_empty():
		return null
	if ResourceLoader.exists(path):
		var scene = load(path) as PackedScene
		if scene:
			model_cache[key] = scene
			return scene
	var fallback = FALLBACK_SCENES.get(key, "")
	if not fallback.is_empty() and ResourceLoader.exists(fallback):
		var scene = load(fallback) as PackedScene
		if scene:
			model_cache[key] = scene
			return scene
	return null

func instantiate_model(key: String) -> Node3D:
	var scene = get_model(key)
	if scene:
		return scene.instantiate() as Node3D
	return _create_placeholder(key)

func _create_placeholder(key: String) -> Node3D:
	match key:
		"tree":
			return _make_tree_placeholder()
		"bench":
			return _make_box_placeholder(Color(0.5, 0.35, 0.2), Vector3(1, 0.5, 0.5))
		"flag":
			return _make_flag_placeholder()
		_:
			return _make_box_placeholder(Color(0.6, 0.6, 0.6), Vector3(0.5, 0.5, 0.5))

func _make_tree_placeholder() -> Node3D:
	var node := Node3D.new()
	node.name = "TreePlaceholder"
	var trunk := MeshInstance3D.new()
	var trunk_mesh := CylinderMesh.new()
	trunk_mesh.top_radius = 0.1
	trunk_mesh.bottom_radius = 0.15
	trunk_mesh.height = 2.0
	trunk.mesh = trunk_mesh
	trunk.position.y = 1.0
	var trunk_mat := StandardMaterial3D.new()
	trunk_mat.albedo_color = Color(0.4, 0.25, 0.12)
	trunk.material_override = trunk_mat
	node.add_child(trunk)
	var canopy := MeshInstance3D.new()
	var sphere := SphereMesh.new()
	sphere.radius = 1.2
	sphere.height = 2.0
	canopy.mesh = sphere
	canopy.position.y = 3.0
	var canopy_mat := StandardMaterial3D.new()
	canopy_mat.albedo_color = Color(0.15, 0.55, 0.2)
	canopy.material_override = canopy_mat
	node.add_child(canopy)
	return node

func _make_box_placeholder(color: Color, size: Vector3) -> Node3D:
	var node := Node3D.new()
	var mesh_inst := MeshInstance3D.new()
	var box := BoxMesh.new()
	box.size = size
	mesh_inst.mesh = box
	mesh_inst.position.y = size.y * 0.5
	var mat := StandardMaterial3D.new()
	mat.albedo_color = color
	mesh_inst.material_override = mat
	node.add_child(mesh_inst)
	return node

func _make_flag_placeholder() -> Node3D:
	var node := Node3D.new()
	var pole := MeshInstance3D.new()
	var pole_mesh := CylinderMesh.new()
	pole_mesh.top_radius = 0.03
	pole_mesh.bottom_radius = 0.03
	pole_mesh.height = 3.0
	pole.mesh = pole_mesh
	pole.position.y = 1.5
	var pole_mat := StandardMaterial3D.new()
	pole_mat.albedo_color = Color(0.5, 0.5, 0.5)
	pole.material_override = pole_mat
	node.add_child(pole)
	var flag := MeshInstance3D.new()
	var flag_mesh := PlaneMesh.new()
	flag_mesh.size = Vector2(1.0, 0.6)
	flag.mesh = flag_mesh
	flag.position = Vector3(0.5, 2.7, 0)
	var flag_mat := StandardMaterial3D.new()
	flag_mat.albedo_color = Color(0.9, 0.2, 0.15)
	flag_mat.cull_mode = BaseMaterial3D.CULL_DISABLED
	flag.material_override = flag_mat
	node.add_child(flag)
	return node

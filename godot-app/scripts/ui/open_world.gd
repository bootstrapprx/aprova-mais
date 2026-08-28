extends Node3D

@onready var player: CharacterBody3D = $Player
@onready var pois_container: Node3D = $POIs
@onready var hud: CanvasLayer = $HUD
@onready var interaction_hint: Label = $HUD/InteractionHint
@onready var xp_label: Label = $HUD/TopBar/XPLabel
@onready var level_label: Label = $HUD/TopBar/LevelLabel
@onready var back_button: Button = $HUD/TopBar/BackButton

var courses: Array = []
var poi_nodes: Array[Node3D] = []
var nearest_poi: Node3D = null
var interaction_distance: float = 5.0

const POI_COLORS := [
	Color(0.2, 0.5, 0.8),
	Color(0.8, 0.3, 0.2),
	Color(0.2, 0.7, 0.4),
	Color(0.8, 0.6, 0.15),
	Color(0.7, 0.3, 0.6),
]

func _ready():
	back_button.pressed.connect(_on_back_pressed)
	XPManager.xp_changed.connect(_on_xp_changed)
	_update_xp_display()
	_generate_world()

func _generate_world() -> void:
	_clear_pois()
	courses = DataManager.get_courses()
	var angle_step := TAU / max(courses.size(), 1)
	var radius := 15.0

	for i in courses.size():
		var course = courses[i]
		var angle := angle_step * i
		var pos := Vector3(cos(angle) * radius, 0, sin(angle) * radius)
		var poi := _create_poi(i, course, pos)
		pois_container.add_child(poi)
		poi_nodes.append(poi)

	_spawn_decorations()

func _create_poi(index: int, course: Dictionary, pos: Vector3) -> Node3D:
	var node := Node3D.new()
	node.position = pos
	node.name = "POI_%d" % index

	var color = POI_COLORS[index % POI_COLORS.size()]

	var base := MeshInstance3D.new()
	var box := BoxMesh.new()
	box.size = Vector3(4, 6, 4)
	base.mesh = box
	base.position.y = 3.0
	var mat := StandardMaterial3D.new()
	mat.albedo_color = color
	mat.emission_enabled = true
	mat.emission = color * 0.2
	mat.emission_energy_multiplier = 0.3
	base.material_override = mat
	base.name = "Building"
	node.add_child(base)

	var roof := MeshInstance3D.new()
	var roof_box := BoxMesh.new()
	roof_box.size = Vector3(4.5, 0.5, 4.5)
	roof.mesh = roof_box
	roof.position.y = 6.25
	var roof_mat := StandardMaterial3D.new()
	roof_mat.albedo_color = color * 0.7
	roof.material_override = roof_mat
	node.add_child(roof)

	var label := Label3D.new()
	label.text = course.get("title", "?")
	label.position = Vector3(0, 7.5, 0)
	label.font_size = 24
	label.modulate = Color(1, 1, 1, 1)
	node.add_child(label)

	var sub_label := Label3D.new()
	sub_label.text = "%s • %d" % [course.get("banca", ""), course.get("ano", 0)]
	sub_label.position = Vector3(0, 7.0, 0)
	sub_label.font_size = 16
	sub_label.modulate = Color(0.8, 0.82, 0.85, 1)
	node.add_child(sub_label)

	var door := MeshInstance3D.new()
	var door_box := BoxMesh.new()
	door_box.size = Vector3(1.2, 2.0, 0.1)
	door.mesh = door_box
	door.position = Vector3(0, 1.0, 2.05)
	var door_mat := StandardMaterial3D.new()
	door_mat.albedo_color = Color(0.35, 0.25, 0.15)
	door.material_override = door_mat
	node.add_child(door)

	var light := OmniLight3D.new()
	light.position = Vector3(0, 4, 3)
	light.light_energy = 0.5
	light.omni_range = 6.0
	light.light_color = color
	node.add_child(light)

	node.set_meta("course", course)
	node.set_meta("course_id", course.get("id", -1))
	return node

func _process(_delta: float) -> void:
	_update_nearest_poi()
	_update_hud()

func _update_nearest_poi() -> void:
	var min_dist := interaction_distance
	nearest_poi = null

	for poi in poi_nodes:
		if not is_instance_valid(poi):
			continue
		var dist = player.global_position.distance_to(poi.global_position + Vector3(0, 1, 0))
		if dist < min_dist:
			min_dist = dist
			nearest_poi = poi

	if nearest_poi:
		var course = nearest_poi.get_meta("course", {})
		interaction_hint.text = "[E] Entrar em %s" % course.get("title", "?")
		interaction_hint.show()
	else:
		interaction_hint.hide()

func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("ui_accept") and nearest_poi:
		var course_id = nearest_poi.get_meta("course_id", -1)
		if course_id >= 0:
			GameManager.start_course(course_id)

func _on_back_pressed() -> void:
	Input.set_mouse_mode(Input.MOUSE_MODE_VISIBLE)
	GameManager.change_state(GameManager.State.MENU)

func _on_xp_changed(_new_xp: int, _new_level: int) -> void:
	_update_xp_display()

func _update_xp_display() -> void:
	xp_label.text = "XP: %d" % XPManager.xp
	level_label.text = "Nível %d" % XPManager.level

func _clear_pois() -> void:
	for child in pois_container.get_children():
		child.queue_free()
	poi_nodes.clear()

func _spawn_decorations() -> void:
	var rng := RandomNumberGenerator.new()
	rng.seed = 42
	for i in 20:
		var angle := rng.randf_range(0, TAU)
		var dist := rng.randf_range(25.0, 45.0)
		var pos := Vector3(cos(angle) * dist, 0, sin(angle) * dist)
		var tree = AssetManager.instantiate_model("tree")
		tree.position = pos
		var s = rng.randf_range(0.8, 1.3)
		tree.scale = Vector3(s, s, s)
		pois_container.add_child(tree)

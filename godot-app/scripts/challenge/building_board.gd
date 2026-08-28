extends Node3D

@onready var camera: Camera3D = $Camera3D
@onready var building_container: Node3D = $BuildingContainer
@onready var floor_labels: Node3D = $FloorLabels
@onready var hud: CanvasLayer = $HUD
@onready var title_label: Label = $HUD/TopBar/TitleLabel
@onready var back_button: Button = $HUD/TopBar/BackButton
@onready var progress_label: Label = $HUD/TopBar/ProgressLabel
@onready var xp_label: Label = $HUD/TopBar/XPLabel

var course_data: Dictionary = {}
var floors: Array = []
var current_floor_index: int = 0
var tile_nodes: Array[Node3D] = []

const FLOOR_HEIGHT: float = 3.0
const TILE_SPACING: float = 2.2
const TILE_SIZE := Vector3(1.8, 0.2, 1.2)
const FLOOR_COLORS := [
	Color(0.2, 0.5, 0.8),
	Color(0.2, 0.7, 0.4),
	Color(0.8, 0.6, 0.15),
	Color(0.7, 0.3, 0.6),
	Color(0.3, 0.7, 0.7),
	Color(0.8, 0.4, 0.2),
]

const COLOR_LOCKED := Color(0.35, 0.35, 0.38)
const COLOR_COMPLETED := Color(0.15, 0.7, 0.3)
const COLOR_CURRENT := Color(0.95, 0.8, 0.15)

signal room_selected(unit_index: int, lesson_index: int)

func _ready():
	back_button.pressed.connect(_on_back_pressed)
	room_selected.connect(_on_room_selected)

func setup(course: Dictionary) -> void:
	course_data = course
	floors.clear()
	current_floor_index = 0
	_clear_building()
	var course_id = course.get("id", 0)
	var layout = DataManager.get_map_layout(course_id)
	if not layout.is_empty() and layout.has("buildings"):
		_build_from_layout(layout)
	else:
		_build_floors()
	_render_current_floor()
	title_label.text = course.get("title", "Curso")
	_update_hud()

func _build_from_layout(layout: Dictionary) -> void:
	var buildings = layout.get("buildings", [])
	if buildings.is_empty():
		_build_floors()
		return
	for building in buildings:
		var building_node := Node3D.new()
		building_node.name = building.get("id", "Building")
		var pos_arr = building.get("position", [0, 0, 0])
		if pos_arr is Array and pos_arr.size() >= 3:
			building_node.position = Vector3(pos_arr[0], pos_arr[1], pos_arr[2])
		_add_building_base(building_node, building.get("name", ""))
		var b_floors = building.get("floors", [])
		for f in b_floors:
			var floor_data := {
				"level": f.get("level", 0),
				"name": f.get("name", "Andar"),
				"lessons": [],
				"building_node": building_node,
			}
			var rooms = f.get("rooms", [])
			for r in rooms:
				floor_data["lessons"].append({
					"unit_index": r.get("unitIndex", 0),
					"lesson_index": r.get("lessonIndex", 0),
					"unit_title": building.get("name", ""),
					"lesson_title": r.get("name", ""),
					"challenge_count": 0,
					"room_id": r.get("id", ""),
				})
			floors.append(floor_data)
		building_container.add_child(building_node)

func _add_building_base(parent: Node3D, name: String) -> void:
	var base := MeshInstance3D.new()
	var box := BoxMesh.new()
	box.size = Vector3(6, 0.5, 4)
	base.mesh = box
	base.position.y = -0.25
	var mat := StandardMaterial3D.new()
	mat.albedo_color = Color(0.3, 0.3, 0.35)
	base.material_override = mat
	parent.add_child(base)
	var label := Label3D.new()
	label.text = name
	label.position = Vector3(0, 1.5, 0)
	label.font_size = 22
	label.modulate = Color(0.9, 0.9, 0.95)
	parent.add_child(label)

func _build_floors() -> void:
	var units = course_data.get("units", [])
	var lesson_counter := 0
	var total_lessons := 0
	for unit in units:
		total_lessons += unit.get("lessons", []).size()

	var lessons_per_floor := 4
	var all_lessons: Array = []
	for unit_idx in units.size():
		var unit = units[unit_idx]
		for lesson_idx in unit.get("lessons", []).size():
			all_lessons.append({
				"unit_index": unit_idx,
				"lesson_index": lesson_idx,
				"unit_title": unit.get("title", ""),
				"lesson_title": unit.get("lessons", [])[lesson_idx].get("title", ""),
				"challenge_count": unit.get("lessons", [])[lesson_idx].get("challenges", []).size(),
				"global_index": total_lessons,
			})
			total_lessons += 1

	for f in range(0, all_lessons.size(), lessons_per_floor):
		var floor_lessons = all_lessons.slice(f, f + lessons_per_floor)
		floors.append({
			"level": floors.size() + 1,
			"name": "Andar %d" % (floors.size() + 1) if floors.size() > 0 else "Térreo",
			"lessons": floor_lessons,
		})

func _render_current_floor() -> void:
	_clear_tiles()
	if current_floor_index < 0 or current_floor_index >= floors.size():
		return

	var floor = floors[current_floor_index]
	var lessons = floor.get("lessons", [])
	var offset_x := -(lessons.size() - 1) * TILE_SPACING * 0.5

	for i in lessons.size():
		var lesson = lessons[i]
		var tile := _create_tile(i, lesson, offset_x + i * TILE_SPACING)
		building_container.add_child(tile)
		tile_nodes.append(tile)

	_render_floor_indicator()
	_update_hud()

func _create_tile(index: int, lesson: Dictionary, x_offset: float) -> Node3D:
	var node := Node3D.new()
	node.position = Vector3(x_offset, 0, 0)
	node.name = "Tile_%d" % index

	var base_color = FLOOR_COLORS[current_floor_index % FLOOR_COLORS.size()]
	var completed = _is_lesson_completed(lesson)
	var is_current = _is_lesson_current(lesson)

	var tile_color: Color
	if completed:
		tile_color = COLOR_COMPLETED
	elif is_current:
		tile_color = COLOR_CURRENT
	else:
		tile_color = base_color

	var platform := MeshInstance3D.new()
	var box := BoxMesh.new()
	box.size = TILE_SIZE
	platform.mesh = box
	platform.position.y = TILE_SIZE.y * 0.5
	var mat := StandardMaterial3D.new()
	mat.albedo_color = tile_color
	mat.emission_enabled = true
	mat.emission = tile_color * 0.15
	mat.emission_energy_multiplier = 0.3
	platform.material_override = mat
	platform.name = "Platform"
	node.add_child(platform)

	var label := Label3D.new()
	label.text = lesson.get("lesson_title", "?")
	label.position = Vector3(0, TILE_SIZE.y + 0.3, 0)
	label.font_size = 18
	label.width = 1.7
	label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	label.modulate = Color(0.95, 0.95, 0.97, 1)
	node.add_child(label)

	var sub_label := Label3D.new()
	sub_label.text = lesson.get("unit_title", "")
	sub_label.position = Vector3(0, TILE_SIZE.y + 0.7, 0)
	sub_label.font_size = 13
	sub_label.width = 1.7
	sub_label.modulate = Color(0.7, 0.72, 0.75, 1)
	node.add_child(sub_label)

	var badge := Label3D.new()
	var count = lesson.get("challenge_count", 0)
	if completed:
		badge.text = "✓ Completa"
		badge.modulate = Color(0.2, 0.9, 0.3, 1)
	elif is_current:
		badge.text = "%d questões" % count
		badge.modulate = Color(0.9, 0.8, 0.1, 1)
	else:
		badge.text = "%d questões" % count
		badge.modulate = Color(0.6, 0.62, 0.65, 1)
	badge.position = Vector3(0, -0.4, 0)
	badge.font_size = 14
	node.add_child(badge)

	var area := Area3D.new()
	area.name = "Area3D"
	var col := CollisionShape3D.new()
	var shape := BoxShape3D.new()
	shape.size = TILE_SIZE + Vector3(0, 0.5, 0.3)
	col.shape = shape
	area.add_child(col)
	area.input_event.connect(func(_cam, event, _pos, _norm, _idx):
		if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
			_on_tile_clicked(index, lesson)
	)
	node.add_child(area)

	node.set_meta("lesson", lesson)
	node.set_meta("index", index)
	return node

func _on_tile_clicked(index: int, lesson: Dictionary) -> void:
	if _is_lesson_completed(lesson):
		room_selected.emit(lesson.get("unit_index", 0), lesson.get("lesson_index", 0))
		return
	room_selected.emit(lesson.get("unit_index", 0), lesson.get("lesson_index", 0))

func _on_room_selected(unit_index: int, lesson_index: int) -> void:
	var challenges: Array = []
	var units = course_data.get("units", [])
	if unit_index < units.size():
		var lessons = units[unit_index].get("lessons", [])
		if lesson_index < lessons.size():
			challenges = lessons[lesson_index].get("challenges", [])

	if challenges.is_empty():
		return

	var main = get_parent()
	if main.has_method("enter_challenge_from_board"):
		main.enter_challenge_from_board(challenges, 0, unit_index, lesson_index)

func _on_back_pressed() -> void:
	GameManager.change_state(GameManager.State.MENU)

func _is_lesson_completed(lesson: Dictionary) -> bool:
	var progress = DataManager.load_progress()
	var completed_lessons: Array = progress.get("completed_lessons", [])
	var unit_idx = lesson.get("unit_index", 0)
	var lesson_idx = lesson.get("lesson_index", 0)
	var units = course_data.get("units", [])
	if unit_idx >= units.size():
		return false
	var lessons = units[unit_idx].get("lessons", [])
	if lesson_idx >= lessons.size():
		return false
	var lesson_id = lessons[lesson_idx].get("id", -1)
	return lesson_id in completed_lessons

func _is_lesson_current(lesson: Dictionary) -> bool:
	if _is_lesson_completed(lesson):
		return false
	var unit_idx = lesson.get("unit_index", 0)
	var lesson_idx = lesson.get("lesson_index", 0)
	var units = course_data.get("units", [])
	if unit_idx >= units.size():
		return false
	var lessons = units[unit_idx].get("lessons", [])
	if lesson_idx >= lessons.size():
		return false
	var lesson_id = lessons[lesson_idx].get("id", -1)
	var progress = DataManager.load_progress()
	var completed: Array = progress.get("completed_lessons", [])
	var all_lessons_before := true
	for u in unit_idx:
		for l in units[u].get("lessons", []):
			if not (l.get("id", -1) in completed):
				all_lessons_before = false
				break
		if not all_lessons_before:
			break
	return all_lessons_before

func _render_floor_indicator() -> void:
	for child in floor_labels.get_children():
		child.queue_free()
	for i in floors.size():
		var btn := Button.new()
		btn.text = floors[i].get("name", "?")
		btn.custom_minimum_size = Vector2(0, 30)
		btn.add_theme_font_size_override("font_size", 13)
		if i == current_floor_index:
			btn.modulate = COLOR_CURRENT
		btn.pressed.connect(_on_floor_button_pressed.bind(i))
		floor_labels.add_child(btn)

func _on_floor_button_pressed(index: int) -> void:
	current_floor_index = index
	_render_current_floor()

func _update_hud() -> void:
	progress_label.text = "Andar %d/%d" % [current_floor_index + 1, floors.size()]
	xp_label.text = "XP: %d" % XPManager.xp

func _clear_building() -> void:
	for child in building_container.get_children():
		child.queue_free()
	tile_nodes.clear()

func _clear_tiles() -> void:
	for child in building_container.get_children():
		child.queue_free()
	tile_nodes.clear()

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_WHEEL_UP and event.pressed:
			_navigate_floor(-1)
		elif event.button_index == MOUSE_BUTTON_WHEEL_DOWN and event.pressed:
			_navigate_floor(1)

func _navigate_floor(direction: int) -> void:
	var new_index = current_floor_index + direction
	if new_index >= 0 and new_index < floors.size():
		current_floor_index = new_index
		_render_current_floor()

func _process(_delta: float) -> void:
	if not visible:
		return
	if Input.is_action_just_pressed("ui_up"):
		_navigate_floor(-1)
	elif Input.is_action_just_pressed("ui_down"):
		_navigate_floor(1)

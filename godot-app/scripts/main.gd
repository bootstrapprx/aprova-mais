extends Node3D

@onready var camera: Camera3D = $Camera3D
@onready var menu_ui: CanvasLayer = $MenuUI
@onready var course_list: VBoxContainer = $MenuUI/Panel/MarginContainer/VBoxContainer/ScrollContainer/CourseList
@onready var start_button: Button = $MenuUI/Panel/MarginContainer/VBoxContainer/StartButton
@onready var xp_label: Label = $MenuUI/Panel/MarginContainer/VBoxContainer/TopBar/XPLabel
@onready var level_label: Label = $MenuUI/Panel/MarginContainer/VBoxContainer/TopBar/LevelLabel
@onready var world_button: Button = $MenuUI/Panel/MarginContainer/VBoxContainer/WorldButton
@onready var graph_button: Button = $MenuUI/Panel/MarginContainer/VBoxContainer/GraphButton

@onready var building_board_scene = preload("res://scenes/challenge/BuildingBoard.tscn")
@onready var challenge_scene = preload("res://scenes/challenge/ChallengeRoom.tscn")
@onready var open_world_scene = preload("res://scenes/world/OpenWorld.tscn")
@onready var graph_scene_scene = preload("res://scenes/challenge/GraphScene.tscn")

var selected_course_id: int = -1
var building_board_instance: Node3D = null
var challenge_room_instance: Node3D = null
var open_world_instance: Node3D = null
var graph_scene_instance: Node3D = null
var current_lesson_challenges: Array = []
var current_unit_index: int = 0
var current_lesson_index: int = 0

func _ready():
	GameManager.state_changed.connect(_on_state_changed)
	XPManager.xp_changed.connect(_on_xp_changed)
	_update_xp_display()
	_populate_courses()
	start_button.pressed.connect(_on_start_pressed)
	start_button.disabled = true
	world_button.pressed.connect(_on_world_pressed)
	graph_button.pressed.connect(_on_graph_pressed)
	AudioManager.play_music("menu_theme")

func _populate_courses() -> void:
	for child in course_list.get_children():
		child.queue_free()
	var courses = DataManager.get_courses()
	for course in courses:
		var btn := Button.new()
		btn.text = "%s (%d)" % [course.get("title", "?"), course.get("ano", 0)]
		btn.custom_minimum_size = Vector2(0, 50)
		btn.alignment = HORIZONTAL_ALIGNMENT_LEFT
		btn.add_theme_font_size_override("font_size", 16)
		btn.pressed.connect(_on_course_selected.bind(course.get("id", -1), btn))
		course_list.add_child(btn)

func _on_course_selected(course_id: int, btn: Button) -> void:
	selected_course_id = course_id
	start_button.disabled = false
	start_button.text = "Iniciar: %s" % btn.text.split(" (")[0]
	for child in course_list.get_children():
		child.modulate = Color.WHITE
	btn.modulate = Color(0.4, 0.7, 1.0)

func _on_start_pressed() -> void:
	if selected_course_id < 0:
		return
	GameManager.start_course(selected_course_id)

func _on_world_pressed() -> void:
	GameManager.change_state(GameManager.State.WORLD)

func _on_graph_pressed() -> void:
	if selected_course_id < 0:
		return
	GameManager.current_course_data = DataManager.get_course(selected_course_id)
	if GameManager.current_course_data.is_empty():
		return
	GameManager.change_state(GameManager.State.GRAPH)

func _on_state_changed(_old: GameManager.State, new_state: GameManager.State) -> void:
	match new_state:
		GameManager.State.MENU:
			menu_ui.show()
			_cleanup_all()
		GameManager.State.LOADING:
			menu_ui.hide()
			_load_building_board()
		GameManager.State.WORLD:
			menu_ui.hide()
			_load_open_world()
		GameManager.State.GRAPH:
			menu_ui.hide()
			_load_graph_scene()
		GameManager.State.BUILDING:
			menu_ui.hide()
			if building_board_instance:
				building_board_instance.show()
		GameManager.State.CHALLENGE:
			menu_ui.hide()
			if challenge_room_instance:
				challenge_room_instance.show()
		GameManager.State.RESULT:
			menu_ui.hide()
			_show_result_overlay()

func _load_building_board() -> void:
	_cleanup_all()
	building_board_instance = building_board_scene.instantiate()
	add_child(building_board_instance)
	building_board_instance.setup(GameManager.current_course_data)
	GameManager.change_state(GameManager.State.BUILDING)

func _load_open_world() -> void:
	_cleanup_all()
	open_world_instance = open_world_scene.instantiate()
	add_child(open_world_instance)

func _load_graph_scene() -> void:
	_cleanup_all()
	graph_scene_instance = graph_scene_scene.instantiate()
	add_child(graph_scene_instance)
	graph_scene_instance.setup(GameManager.current_course_data)

func enter_challenge_from_graph(challenges: Array, start_index: int = 0, unit_idx: int = 0, lesson_idx: int = 0) -> void:
	current_lesson_challenges = challenges
	current_unit_index = unit_idx
	current_lesson_index = lesson_idx
	if graph_scene_instance:
		graph_scene_instance.hide()
	GameManager.current_challenge_index = start_index
	_load_challenge_room(challenges)

func enter_challenge_from_board(challenges: Array, start_index: int = 0, unit_idx: int = 0, lesson_idx: int = 0) -> void:
	current_lesson_challenges = challenges
	current_unit_index = unit_idx
	current_lesson_index = lesson_idx
	if building_board_instance:
		building_board_instance.hide()
	GameManager.current_challenge_index = start_index
	_load_challenge_room(challenges)

func _load_challenge_room(challenges: Array) -> void:
	challenge_room_instance = challenge_scene.instantiate()
	add_child(challenge_room_instance)
	challenge_room_instance.setup(challenges[GameManager.current_challenge_index])
	challenge_room_instance.challenge_completed.connect(_on_challenge_completed.bind(challenges))
	GameManager.change_state(GameManager.State.CHALLENGE)

func _on_challenge_completed(correct: bool, _xp_earned: int, challenges: Array) -> void:
	GameManager.report_challenge_result(correct)
	challenge_room_instance.challenge_completed.disconnect(_on_challenge_completed)
	var timer := get_tree().create_timer(1.5)
	await timer.timeout
	GameManager.current_challenge_index += 1
	if GameManager.current_challenge_index < challenges.size():
		if challenge_room_instance:
			challenge_room_instance.queue_free()
			challenge_room_instance = null
		_load_challenge_room(challenges)
	else:
		_mark_lesson_complete()
		if challenge_room_instance:
			challenge_room_instance.queue_free()
			challenge_room_instance = null
		GameManager.change_state(GameManager.State.BUILDING)

func _mark_lesson_complete() -> void:
	var units = GameManager.current_course_data.get("units", [])
	if current_unit_index >= units.size():
		return
	var lessons = units[current_unit_index].get("lessons", [])
	if current_lesson_index >= lessons.size():
		return
	var lesson_id = lessons[current_lesson_index].get("id", -1)
	var progress = DataManager.load_progress()
	var completed: Array = progress.get("completed_lessons", [])
	if not (lesson_id in completed):
		completed.append(lesson_id)
		progress["completed_lessons"] = completed
		DataManager.save_progress(progress)
		XPManager.add_lesson_complete_xp()

func _show_result_overlay() -> void:
	menu_ui.show()
	_cleanup_all()
	for child in course_list.get_children():
		child.queue_free()
	var result_label := Label.new()
	result_label.text = "Sessão Concluída!\nAcertos: %d / %d\nXP ganho: %d" % [
		GameManager.session_correct_count,
		GameManager.session_total,
		GameManager.session_score * XPManager.XP_PER_CHALLENGE_CORRECT
	]
	result_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	result_label.add_theme_font_size_override("font_size", 22)
	course_list.add_child(result_label)
	start_button.text = "Voltar ao Menu"
	start_button.disabled = false
	start_button.pressed.disconnect(_on_start_pressed)
	start_button.pressed.connect(_on_back_to_menu)

func _on_back_to_menu() -> void:
	start_button.pressed.disconnect(_on_back_to_menu)
	start_button.pressed.connect(_on_start_pressed)
	_populate_courses()
	start_button.disabled = true
	start_button.text = "Selecionar um curso"
	GameManager.change_state(GameManager.State.MENU)

func _cleanup_all() -> void:
	if building_board_instance:
		building_board_instance.queue_free()
		building_board_instance = null
	if challenge_room_instance:
		challenge_room_instance.queue_free()
		challenge_room_instance = null
	if open_world_instance:
		open_world_instance.queue_free()
		open_world_instance = null
	if graph_scene_instance:
		graph_scene_instance.queue_free()
		graph_scene_instance = null

func _on_xp_changed(_new_xp: int, _new_level: int) -> void:
	_update_xp_display()

func _update_xp_display() -> void:
	xp_label.text = "XP: %d" % XPManager.xp
	level_label.text = "Nível %d" % XPManager.level

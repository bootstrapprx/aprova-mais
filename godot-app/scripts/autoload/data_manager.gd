extends Node

const COURSES_PATH = "res://data/courses.json"
const PROGRESS_PATH = "user://user_progress.json"
const MAP_LAYOUTS_PATH = "user://map_layouts.json"

var courses_cache: Array = []
var map_layouts_cache: Dictionary = {}
var is_loaded: bool = false

func _ready():
	load_local_courses()

func load_local_courses() -> void:
	var file = FileAccess.open(COURSES_PATH, FileAccess.READ)
	if not file:
		push_error("Could not open: " + COURSES_PATH)
		return
	var json = JSON.new()
	var err = json.parse(file.get_as_text())
	if err != OK:
		push_error("JSON parse error: " + json.get_error_message())
		return
	var data = json.data
	if typeof(data) == TYPE_ARRAY:
		courses_cache = data
		is_loaded = true
	else:
		push_error("Expected array at root of courses.json")

func get_courses() -> Array:
	return courses_cache

func get_course(course_id: int) -> Dictionary:
	for c in courses_cache:
		if c.get("id") == course_id:
			return c
	return {}

func get_all_challenges() -> Array:
	var all: Array = []
	for course in courses_cache:
		for unit in course.get("units", []):
			for lesson in unit.get("lessons", []):
				for challenge in lesson.get("challenges", []):
					var entry := challenge.duplicate()
					entry["_course_title"] = course.get("title", "")
					entry["_unit_title"] = unit.get("title", "")
					entry["_lesson_title"] = lesson.get("title", "")
					all.append(entry)
	return all

func save_progress(progress: Dictionary) -> void:
	var file = FileAccess.open(PROGRESS_PATH, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(progress, "\t"))
	else:
		push_error("Could not save progress to: " + PROGRESS_PATH)

func load_progress() -> Dictionary:
	if FileAccess.file_exists(PROGRESS_PATH):
		var file = FileAccess.open(PROGRESS_PATH, FileAccess.READ)
		if file:
			var json = JSON.new()
			if json.parse(file.get_as_text()) == OK:
				if typeof(json.data) == TYPE_DICTIONARY:
					return json.data
	return _default_progress()

func _default_progress() -> Dictionary:
	return {
		"xp": 0,
		"level": 1,
		"completed_challenges": [],
		"completed_lessons": [],
		"completed_units": [],
		"course_progress": {},
	}

func clear_progress() -> void:
	save_progress(_default_progress())

func get_map_layout(course_id: int) -> Dictionary:
	if map_layouts_cache.has(course_id):
		return map_layouts_cache[course_id]
	_load_map_layouts()
	return map_layouts_cache.get(course_id, {})

func set_map_layout(course_id: int, layout: Dictionary) -> void:
	map_layouts_cache[course_id] = layout
	_save_map_layouts()

func _load_map_layouts() -> void:
	if not FileAccess.file_exists(MAP_LAYOUTS_PATH):
		return
	var file = FileAccess.open(MAP_LAYOUTS_PATH, FileAccess.READ)
	if not file:
		return
	var json = JSON.new()
	if json.parse(file.get_as_text()) != OK:
		return
	if typeof(json.data) == TYPE_DICTIONARY:
		map_layouts_cache = json.data

func _save_map_layouts() -> void:
	var file = FileAccess.open(MAP_LAYOUTS_PATH, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(map_layouts_cache, "\t"))
	else:
		push_error("Could not save map layouts")

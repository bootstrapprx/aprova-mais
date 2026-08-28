extends RefCounted
class_name CourseLoader

static func load_from_file(path: String) -> Array:
	var file = FileAccess.open(path, FileAccess.READ)
	if not file:
		push_error("Could not open: " + path)
		return []
	var json = JSON.new()
	var err = json.parse(file.get_as_text())
	if err != OK:
		push_error("JSON parse error at %s:%d: %s" % [path, json.get_error_line(), json.get_error_message()])
		return []
	if typeof(json.data) != TYPE_ARRAY:
		push_error("Expected array at root of " + path)
		return []
	return json.data

static func get_flat_challenges(courses: Array) -> Array:
	var result: Array = []
	for course in courses:
		for unit in course.get("units", []):
			for lesson in unit.get("lessons", []):
				for challenge in lesson.get("challenges", []):
					result.append({
						"challenge": challenge,
						"course_title": course.get("title", ""),
						"course_id": course.get("id", -1),
						"unit_title": unit.get("title", ""),
						"lesson_title": lesson.get("title", ""),
					})
	return result

static func count_challenges(course: Dictionary) -> int:
	var total := 0
	for unit in course.get("units", []):
		for lesson in unit.get("lessons", []):
			total += lesson.get("challenges", []).size()
	return total

static func count_lessons(course: Dictionary) -> int:
	var total := 0
	for unit in course.get("units", []):
		total += unit.get("lessons", []).size()
	return total

static func count_units(course: Dictionary) -> int:
	return course.get("units", []).size()

static func get_challenge_at(course: Dictionary, unit_idx: int, lesson_idx: int, challenge_idx: int) -> Dictionary:
	var units = course.get("units", [])
	if unit_idx >= units.size():
		return {}
	var lessons = units[unit_idx].get("lessons", [])
	if lesson_idx >= lessons.size():
		return {}
	var challenges = lessons[lesson_idx].get("challenges", [])
	if challenge_idx >= challenges.size():
		return {}
	return challenges[challenge_idx]

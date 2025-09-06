import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Tripform = () => {
  const [form, setForm] = useState({
    days: "",
    location: "",
    people: "",
    budgetMin: "",
    budgetMax: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseInt(form.budgetMin) > parseInt(form.budgetMax)) {
      alert("Minimum budget cannot be greater than maximum budget");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/tripform/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      
      if (data.error) {
        alert("Error generating itinerary: " + data.error);
        return;
      }
      
      navigate("/tripform/itinerary", { state: { itinerary: data } });
    } catch (err) {
      console.error(err);
      alert("Error generating itinerary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-6">
      <form
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg flex flex-col gap-6"
        onSubmit={handleSubmit}
      >
        <label className="flex flex-col font-semibold text-gray-700">
          Number of Days
          <select
            name="days"
            value={form.days}
            onChange={handleChange}
            className="mt-2 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-300"
            required
          >
            <option value="">Select days</option>
            {[...Array(15)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col font-semibold text-gray-700">
          Location
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="mt-2 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-300"
            placeholder="Enter location"
            required
          />
        </label>
        <label className="flex flex-col font-semibold text-gray-700">
          Number of People
          <select
            name="people"
            value={form.people}
            onChange={handleChange}
            className="mt-2 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-300"
            required
          >
            <option value="">Select people</option>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-col font-semibold text-gray-700">
          Budget (₹)
          <div className="flex gap-4 mt-2">
            <input
              type="number"
              name="budgetMin"
              value={form.budgetMin}
              onChange={handleChange}
              className="p-2 rounded-lg border border-gray-300 w-1/2 focus:ring-2 focus:ring-pink-300"
              placeholder="Min"
              min="0"
              required
            />
            <input
              type="number"
              name="budgetMax"
              value={form.budgetMax}
              onChange={handleChange}
              className="p-2 rounded-lg border border-gray-300 w-1/2 focus:ring-2 focus:ring-pink-300"
              placeholder="Max"
              min="0"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-pink-300 via-rose-300 to-pink-400 text-white font-semibold py-2 rounded-lg shadow-md hover:from-pink-400 hover:to-rose-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Planning Your Trip..." : "Plan My Trip"}
        </button>
      </form>
    </div>
  );
};

export default Tripform;
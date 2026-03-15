import sys
from qiskit import QuantumCircuit, transpile
from qiskit.circuit.library import grover_operator
from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler

name_to_index = {
    "A1": 0,
    "B2": 1,
    "C3": 2,
    "D4": 3
}

def grover_search_by_name(query_name: str):
    if query_name not in name_to_index:
        return {"found": False, "id": None, "index": None}

    target_index = name_to_index[query_name]
    n = 2
    
    oracle = QuantumCircuit(n)
    bin_str = f"{target_index:02b}"
    for i, bit in enumerate(reversed(bin_str)):
        if bit == '0':
            oracle.x(i)
    oracle.cz(0, 1)
    for i, bit in enumerate(reversed(bin_str)):
        if bit == '0':
            oracle.x(i)

    qc = QuantumCircuit(n)
    qc.h(range(n))
    qc.compose(grover_operator(oracle), inplace=True)

    qc.measure_all()

    service = QiskitRuntimeService()
    backend = service.least_busy(operational=True, simulator=False)
    transpiled_qc = transpile(qc, backend=backend, optimization_level=3)
    
    print(f"Original depth: {qc.depth()}")
    print(f"Transpiled depth: {transpiled_qc.depth()} on {backend.name}")

    sampler = Sampler(mode=backend)
    job = sampler.run([transpiled_qc])
    print(f"Job ID: {job.job_id()}")
    print("Waiting for results (will probably take a sec)")
    
    return job.result()

if __name__ == "__main__":
    query = sys.argv[1]
    result = grover_search_by_name(query)
    print(result)